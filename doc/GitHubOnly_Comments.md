# GitHubOnly_Comments.md

Your GitHub Pages site can implement a basic comment system using only GitHub’s own infrastructure (Issues or repo files) plus Actions. This is truly zero-cost and fine for low-traffic, non-real-time use.

---

## Option A: Utterances (Recommended)
Utterances is a lightweight comment widget that stores comments in GitHub Issues.

1. **Create a repository** (e.g. `yourname/comments`).
2. **Install Utterances** on your Pages repo:
   - Add this snippet where you want comments:
     ```html
     <script src="https://utteranc.es/client.js"
             repo="yourname/comments"
             issue-term="pathname"
             theme="github-light"
             crossorigin="anonymous"
             async>
     </script>
     ```
   - Configure `issue-term` to `pathname`, `url`, or custom.
3. **Authorize Utterances**:
   - Visit `https://utteranc.es` and click *Install*.
   - Grant access to your `comments` repo.
4. **Publish**. Users can now leave comments via the widget (backed by GitHub Issues).

**Pros:** Instant setup, comment editing via GitHub, no Actions needed  
**Cons:** UX is a GitHub-like modal, not a custom form  

---

## Option B: Custom Form + GitHub Actions
Use a static HTML form that triggers a GitHub Actions workflow to commit comment data to `comments.json`.

### 1. Create a Personal Access Token (PAT)
- Go to GitHub Settings → Developer Settings → Personal Access Tokens.
- Generate a token with `repo` scope.
- In your Pages repo, add a secret named `GH_TOKEN` with this PAT.

### 2. Add the HTML Form
```html
<form id="comment-form">
  <input name="user" placeholder="Your name" required/>
  <textarea name="message" placeholder="Your comment" required></textarea>
  <button type="submit">Post Comment</button>
</form>
<script>
document.getElementById('comment-form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    user: e.target.user.value,
    message: e.target.message.value,
    time: new Date().toISOString()
  };
  await fetch('https://api.github.com/repos/yourname/yourrepo/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.everest-preview+json',
      'Authorization': 'token ' + '<!-- GH_TOKEN injected by build -->'
    },
    body: JSON.stringify({
      event_type: 'new-comment',
      client_payload: data
    })
  });
  alert('Comment submitted! It may take a minute to appear.');
});
</script>
```

### 3. Create the Action Workflow
In `.github/workflows/comments.yml`:
```yaml
name: Handle New Comment
on:
  repository_dispatch:
    types: [ new-comment ]

jobs:
  add-comment:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Append comment
      run: |
        payload=$(jq .client_payload $GITHUB_EVENT_PATH)
        jq ". += [\$payload]" comments.json > new.json
        mv new.json comments.json
        git config user.name "github-actions[bot]"
        git config user.email "actions@github.com"
        git add comments.json
        git commit -m "Add comment from ${{ github.event.client_payload.user }}"
        git push
    - name: Trigger Pages rebuild
      uses: peter-evans/repository-dispatch@v2
      with:
        token: ${{ secrets.GH_TOKEN }}
        event-type: regen-pages
```

### 4. Rebuild on Comments
Add another workflow `.github/workflows/pages.yml`:
```yaml
name: Regenerate Pages
on:
  repository_dispatch:
    types: [ regen-pages ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build & Deploy
      run: |
        # your build commands
        # e.g., Jekyll build, Hugo build, etc.
        cp -r public/* .
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GH_TOKEN }}
        publish_dir: ./_site
```

### 5. Display Comments
In your pages, fetch and render `comments.json` at build time (liquid template or JS fetch).  
Example (liquid):
```liquid
{% for c in site.data.comments %}
<div class="comment">
  <strong>{{ c.user }}</strong> at {{ c.time }}:
  <p>{{ c.message }}</p>
</div>
{% endfor %}
```

---

**Caveats**  
- **Latency:** Comments appear after the Action runs (~1–2 minutes).  
- **Rate Limits:** GitHub API limits apply.  
- **Security:** Exposing GH_TOKEN requires injecting via CI; never embed in client-side code.

This approach is perfect for low-traffic sites where you want a zero-cost, all-GitHub solution.  
