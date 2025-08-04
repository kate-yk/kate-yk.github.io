// GYCO Controller - Imports base functionality
import { initializeBaseController } from '../core-module.js';

// Initialize base functionality
initializeBaseController();

/////////////////////////////////////////////
// Add GYCO-specific functionality here
/////////////////////////////////////////////

// Manual refresh with button
(function() {
    // Create refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 9999;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    refreshBtn.addEventListener('mouseenter', () => {
        refreshBtn.style.transform = 'scale(1.1)';
        refreshBtn.style.background = '#2980b9';
    });
    
    refreshBtn.addEventListener('mouseleave', () => {
        refreshBtn.style.transform = 'scale(1)';
        refreshBtn.style.background = '#3498db';
    });
    
    refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            location.reload();
        }, 500);
    });
    
    document.body.appendChild(refreshBtn);
    
    // Add keyboard shortcut (Ctrl+R or Cmd+R)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshBtn.click();
        }
    });
})();

// Social Media Link Handler - Community Standard Approach
(function() {
    // Configuration object for social media links (no hardcoded URLs)
    const socialMediaConfig = {
        'x-link': {
            platform: 'X (Twitter)',
            message: 'Official X account coming soon!',
            fallbackUrl: '#',
            isActive: false
        },
        'facebook-link': {
            platform: 'Facebook',
            message: 'Official Facebook page coming soon!',
            fallbackUrl: '#',
            isActive: false
        },
        'instagram-link': {
            platform: 'Instagram',
            message: 'Official Instagram account coming soon!',
            fallbackUrl: '#',
            isActive: false
        },
        'youtube-link': {
            platform: 'YouTube',
            message: 'Official YouTube channel coming soon!',
            fallbackUrl: '#',
            isActive: false
        }
    };

    // Helper function to check if a URL is valid/external
    function isValidExternalUrl(url) {
        if (!url || url === '#' || url === '') return false;
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    // Helper function to show user-friendly notification
    function showComingSoonMessage(platform, message) {
        // Create a more professional notification instead of alert
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-info-circle" style="color: #3498db;"></i>
                <div>
                    <strong>${platform}</strong><br>
                    <small>${message}</small>
                </div>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Main function to handle social media links
    function handleSocialMediaLinks() {
        Object.keys(socialMediaConfig).forEach(linkId => {
            const linkElement = document.getElementById(linkId);
            const config = socialMediaConfig[linkId];
            
            if (!linkElement) {
                console.warn(`Social media link with ID '${linkId}' not found`);
                return;
            }
            
            // Get the href from the HTML element (no hardcoded values)
            const href = linkElement.getAttribute('href');
            const isActive = isValidExternalUrl(href);
            
            // Update config based on current state
            config.isActive = isActive;
            
            if (isActive) {
                // Link is active (has valid external URL from HTML)
                linkElement.style.opacity = '1';
                linkElement.style.cursor = 'pointer';
                linkElement.title = `Follow us on ${config.platform}`;
                
                // Ensure proper attributes for external links
                if (!linkElement.hasAttribute('target')) {
                    linkElement.setAttribute('target', '_blank');
                }
                if (!linkElement.hasAttribute('rel')) {
                    linkElement.setAttribute('rel', 'noopener noreferrer');
                }
            } else {
                // Link is not active, add event listener for "coming soon" message
                linkElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    showComingSoonMessage(config.platform, config.message);
                });
                
                // Add visual indicator that link is not active
                linkElement.style.opacity = '0.6';
                linkElement.style.cursor = 'not-allowed';
                linkElement.title = `${config.platform} - Coming Soon`;
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleSocialMediaLinks);
    } else {
        handleSocialMediaLinks();
    }
})();