// YouTube Video Control Extension - Content Script

let isProcessing = false;

function addControlButtons() {
  if (isProcessing) return;
  isProcessing = true;

  const richVideoCards = document.querySelectorAll('ytd-rich-item-renderer:not([data-control-buttons-added])');
  const compactVideoCards = document.querySelectorAll('ytd-compact-video-renderer:not([data-control-buttons-added])');
  
  richVideoCards.forEach(card => {
    try {
      addButtonsToCard(card);
      card.setAttribute('data-control-buttons-added', 'true');
    } catch (error) {
      console.log('Error adding buttons to rich card:', error);
    }
  });

  compactVideoCards.forEach(card => {
    try {
      addButtonsToCompactCard(card);
      card.setAttribute('data-control-buttons-added', 'true');
    } catch (error) {
      console.log('Error adding buttons to compact card:', error);
    }
  });

  isProcessing = false;
}

function addButtonsToCard(card) {
  const menuContainer = card.querySelector('#menu');
  if (!menuContainer) return;

  const existingButtons = card.querySelector('.youtube-control-buttons');
  if (existingButtons) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'youtube-control-buttons';
  
  const notInterestedBtn = document.createElement('button');
  notInterestedBtn.className = 'youtube-control-btn not-interested-btn';
  notInterestedBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4L12 16M12 16L7 11M12 16L17 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  notInterestedBtn.title = 'この動画に興味がない';
  
  const dontRecommendBtn = document.createElement('button');
  dontRecommendBtn.className = 'youtube-control-btn dont-recommend-btn';
  dontRecommendBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
  `;
  dontRecommendBtn.title = 'このチャンネルをおすすめに表示しない';

  notInterestedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNotInterested(card);
  });

  dontRecommendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDontRecommend(card);
  });

  buttonsContainer.appendChild(notInterestedBtn);
  buttonsContainer.appendChild(dontRecommendBtn);
  
  menuContainer.parentNode.insertBefore(buttonsContainer, menuContainer);
}

function addButtonsToCompactCard(card) {
  const menuContainer = card.querySelector('#menu');
  if (!menuContainer) return;

  const existingButtons = card.querySelector('.youtube-control-buttons');
  if (existingButtons) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'youtube-control-buttons compact-buttons';
  
  const notInterestedBtn = document.createElement('button');
  notInterestedBtn.className = 'youtube-control-btn not-interested-btn';
  notInterestedBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4L12 16M12 16L7 11M12 16L17 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  notInterestedBtn.title = 'この動画に興味がない';
  
  const dontRecommendBtn = document.createElement('button');
  dontRecommendBtn.className = 'youtube-control-btn dont-recommend-btn';
  dontRecommendBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
  `;
  dontRecommendBtn.title = 'このチャンネルをおすすめに表示しない';

  notInterestedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNotInterested(card);
  });

  dontRecommendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDontRecommend(card);
  });

  buttonsContainer.appendChild(notInterestedBtn);
  buttonsContainer.appendChild(dontRecommendBtn);
  
  menuContainer.appendChild(buttonsContainer);
}

function handleNotInterested(card) {
  const menuButton = card.querySelector('ytd-menu-renderer yt-icon-button button');
  if (menuButton) {
    menuButton.click();
    
    setTimeout(() => {
      const menuItems = document.querySelectorAll('tp-yt-paper-listbox ytd-menu-service-item-renderer');
      let notInterestedOption = null;
      
      menuItems.forEach(item => {
        const text = item.querySelector('yt-formatted-string');
        if (text && text.textContent.includes('興味なし')) {
          notInterestedOption = item;
        }
      });
      
      if (notInterestedOption) {
        notInterestedOption.click();
        hideCard(card, '興味がない動画として設定しました');
      }
    }, 100);
  }
}

function handleDontRecommend(card) {
  const menuButton = card.querySelector('ytd-menu-renderer yt-icon-button button');
  if (menuButton) {
    menuButton.click();
    
    setTimeout(() => {
      const menuItems = document.querySelectorAll('tp-yt-paper-listbox ytd-menu-service-item-renderer');
      let dontRecommendOption = null;
      
      menuItems.forEach(item => {
        const text = item.querySelector('yt-formatted-string');
        if (text && text.textContent.includes('チャンネルをおすすめに表示しない')) {
          dontRecommendOption = item;
        }
      });
      
      if (dontRecommendOption) {
        dontRecommendOption.click();
        hideCard(card, 'チャンネルを非表示に設定しました');
      }
    }, 100);
  }
}

function hideCard(card, message) {
  card.style.transition = 'opacity 0.3s ease';
  card.style.opacity = '0.5';
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'youtube-control-message';
  messageDiv.textContent = message;
  card.appendChild(messageDiv);
  
  setTimeout(() => {
    card.style.display = 'none';
  }, 1500);
}

const observer = new MutationObserver((mutations) => {
  let shouldProcess = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches && (node.matches('ytd-rich-item-renderer') || node.matches('ytd-compact-video-renderer'))) {
            shouldProcess = true;
          } else if (node.querySelector && (node.querySelector('ytd-rich-item-renderer') || node.querySelector('ytd-compact-video-renderer'))) {
            shouldProcess = true;
          }
        }
      });
    }
  });
  
  if (shouldProcess) {
    setTimeout(addControlButtons, 100);
    setTimeout(addControlButtons, 500);
    setTimeout(addControlButtons, 1000);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle page navigation with better detection
let currentUrl = window.location.href;

// Listen for YouTube's app-route-change event
document.addEventListener('yt-navigate-start', () => {
  setTimeout(addControlButtons, 100);
  setTimeout(addControlButtons, 500);
  setTimeout(addControlButtons, 1000);
  setTimeout(addControlButtons, 2000);
});

document.addEventListener('yt-navigate-finish', () => {
  setTimeout(addControlButtons, 100);
  setTimeout(addControlButtons, 500);
  setTimeout(addControlButtons, 1000);
  setTimeout(addControlButtons, 2000);
});

// Fallback URL observer
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    setTimeout(addControlButtons, 100);
    setTimeout(addControlButtons, 500);
    setTimeout(addControlButtons, 1000);
    setTimeout(addControlButtons, 2000);
  }
});

urlObserver.observe(document, { subtree: true, childList: true });

addControlButtons();

setInterval(addControlButtons, 3000);