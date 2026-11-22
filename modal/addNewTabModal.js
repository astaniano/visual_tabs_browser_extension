const addOrEditTabForm = document.getElementById('add-or-edit-tab-form')
const newTabUrl = document.getElementById('new-tab-url')
const newTabName = document.getElementById('new-tab-name')
const newTabBgColor = document.getElementById('new-tab-color')
const tabFormHeading = document.getElementById('tab-form-heading')
const tabFormSubmit = document.getElementById('tab-form-submit')

const defaultTabColor = '#d5d6d0'
// null means the form is creating a tab; a number is the index being edited
let editingTabIndex = null

function resetTabForm() {
    newTabUrl.value = ''
    newTabName.value = ''
    newTabBgColor.value = defaultTabColor
}

function openAddTabModal() {
    editingTabIndex = null
    resetTabForm()
    tabFormHeading.innerText = 'New tab'
    tabFormSubmit.value = 'Save'
    document.getElementById('add-new-tab-modal').style.display = 'block'
}

async function openEditTabModal(tabIndex) {
    const tabsFromStore = await getTabsFromStore()
    const arrOfTabs = JSON.parse(tabsFromStore || '[]')
    const tab = arrOfTabs[tabIndex]

    if (!tab) {
        return
    }

    editingTabIndex = tabIndex
    newTabUrl.value = tab.url
    newTabName.value = tab.displayName
    newTabBgColor.value = tab.bgColor || defaultTabColor
    tabFormHeading.innerText = 'Edit tab'
    tabFormSubmit.value = 'Update'
    document.getElementById('add-new-tab-modal').style.display = 'block'
}

addOrEditTabForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (
      !newTabUrl.value.startsWith('http') &&
      !newTabUrl.value.startsWith('file:///')
    ) {
        alert('Invalid URL')
        return
    }
    const visualTab = {
        url: newTabUrl.value,
        displayName: newTabName.value,
        bgColor: newTabBgColor.value
    }

    const tabsFromStore = await getTabsFromStore()
    const arrOfTabs = JSON.parse(tabsFromStore || '[]')

    if (editingTabIndex === null) {
        arrOfTabs.push(visualTab)
    } else {
        arrOfTabs[editingTabIndex] = visualTab
    }

    const updatedTabsAsString = JSON.stringify(arrOfTabs, null, 2)

    await saveTabsToStore(updatedTabsAsString)

    editingTabIndex = null
    resetTabForm()

    const addNewTabModal = document.getElementById("add-new-tab-modal");
    addNewTabModal.style.display = "none";

    await recreateVisualTabs()
})
