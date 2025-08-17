from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")
@app.route("/")
def index():
    return send_from_directory("static", "index.html")
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory("static", filename) ## root path is 'static', 
if __name__ == "__main__":
    app.run(port=8080)





# app = Flask(__name__)

# @app.route("/")
# def index():
#     return send_from_directory("public", "index.html")

# @app.route("/public/<path:filename>")
# def serve_public(filename):
#     return send_from_directory("public", filename)

# @app.route("/src/<path:filename>")
# def serve_src(filename):
#     return send_from_directory("src", filename)

# if __name__ == "__main__":
#     app.run(port=8080)



## Path specification
# '/{path}' for absolute path from the root
# './{path}' or '../{path}' for relative path from current directory of the file (pwd).


### Abstraction Level
# human language:                   Korean / English / Spanish / Japanese
# programming language (human):     Python / Java / C++     <- computers cannot understand
# native language (machine):        Binary / Assembly       <- computers can undetstand 10101000101010110101
