function appendCreateTabBtn(visualTabsContainer) {
    const addNewTabModal = document.getElementById("add-new-tab-modal");
    const addNewTabBtn = document.createElement("button")

    addNewTabBtn.innerText = "+";
    addNewTabBtn.classList.add('link')
    addNewTabBtn.classList.add('add-new-link-btn')
    addNewTabBtn.addEventListener('click', () => {
      addNewTabModal.style.display = "block";
    })

    visualTabsContainer.appendChild(addNewTabBtn)
}

function appendVisualTab(visualTabsContainer, tab) {
    const visualTab = document.createElement("button")

    const name = tab.displayName
    const text = name.length > 10 ? `${name.slice(0, 7)}...` : name

    visualTab.innerText = text
    visualTab.classList.add('link')
    visualTab.style.backgroundColor = tab.bgColor
    visualTab.addEventListener('click', () => {
        location.assign(tab.url)
    })

    visualTabsContainer.appendChild(visualTab)
}

async function recreateVisualTabs() {
    const visualTabsContainer = document.getElementById('visual-tabs-container')

    const savedTabsAsString = await getTabsFromStore()

    // if there are 0 tabs stored, simply add "create a new tab btn"
    if (savedTabsAsString?.length < 1) {
        appendCreateTabBtn(visualTabsContainer)
        return
    }

    let arrOfTabs

    try {
        arrOfTabs = JSON.parse(savedTabsAsString)
    } catch (error) {
        alert('invalid json')
        throw new Error('invalid json')
    }

    visualTabsContainer.replaceChildren([])

    for (const tab of arrOfTabs) {
        appendVisualTab(visualTabsContainer, tab)
    }

    appendCreateTabBtn(visualTabsContainer)
}

// When the user clicks anywhere outside of any of the modals, close it
window.onclick = function(event) {
  const settingsModal = document.getElementById("settings-modal");
  const addNewTabModal = document.getElementById("add-new-tab-modal");

  if (event.target === addNewTabModal) {
    addNewTabModal.style.display = "none";
  } else if (event.target === settingsModal) {
    settingsModal.style.display = "none";
  }
}

recreateVisualTabs()
