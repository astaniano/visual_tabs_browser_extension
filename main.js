function appendCreateTabBtn(visualTabsContainer) {
    const addNewTabBtn = document.createElement("button")

    addNewTabBtn.innerText = "+";
    addNewTabBtn.classList.add('link')
    addNewTabBtn.classList.add('add-new-link-btn')
    addNewTabBtn.addEventListener('click', () => {
      openAddTabModal()
    })

    visualTabsContainer.appendChild(addNewTabBtn)
}

async function removeTabAtIndex(tabIndex) {
    const savedTabsAsString = await getTabsFromStore()
    const arrOfTabs = JSON.parse(savedTabsAsString || '[]')
    arrOfTabs.splice(tabIndex, 1)
    await saveTabsToStore(JSON.stringify(arrOfTabs, null, 2))
    await recreateVisualTabs()
}

function appendVisualTab(visualTabsContainer, tab, tabIndex) {
    const wrapper = document.createElement("div")
    wrapper.classList.add('visual-tab-wrapper')

    const visualTab = document.createElement("button")

    const name = tab.displayName
    const text = name.length > 10 ? `${name.slice(0, 7)}...` : name

    visualTab.innerText = text
    visualTab.classList.add('link')
    visualTab.classList.add('visual-tab')
    visualTab.style.backgroundColor = tab.bgColor
    visualTab.addEventListener('click', () => {
        location.assign(tab.url)
    })

    const removeBtn = document.createElement("button")
    removeBtn.innerText = "×"
    removeBtn.classList.add('remove-tab-btn')
    removeBtn.setAttribute('aria-label', `Remove ${name}`)
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        removeTabAtIndex(tabIndex)
    })

    const editBtn = document.createElement("button")
    editBtn.innerText = "Edit"
    editBtn.classList.add('edit-tab-btn')
    editBtn.setAttribute('aria-label', `Edit ${name}`)
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        openEditTabModal(tabIndex)
    })

    wrapper.appendChild(visualTab)
    wrapper.appendChild(editBtn)
    wrapper.appendChild(removeBtn)
    visualTabsContainer.appendChild(wrapper)
}

async function recreateVisualTabs() {
    const visualTabsContainer = document.getElementById('visual-tabs-container')

    const savedTabsAsString = await getTabsFromStore()

    appendCreateTabBtn(visualTabsContainer)

    // if there are 0 tabs stored, simply do nothing
    if (savedTabsAsString === '[]') {
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

    arrOfTabs.forEach((tab, index) => {
        appendVisualTab(visualTabsContainer, tab, index)
    })

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
