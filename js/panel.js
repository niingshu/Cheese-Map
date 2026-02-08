//set the width of the side bar to 250px (to show it)
export function openPanel() {
    document.getElementById('cheeseSidePanel').style.width = "380px";
}
window.openPanel = openPanel; //visible to html

//set the width of the sidebar to 0
export function closePanel() {
    document.getElementById('cheeseSidePanel').style.width = "0";
}
window.closePanel = closePanel;