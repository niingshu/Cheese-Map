//set the width of the side bar to 250px (to show it)
export function openPanel() {
    const pane = document.getElementById('cheeseSidePanel')
    pane.style.width = "380px";
    pane.style.top = '';
    pane.style.left = '';
    pane.style.right = '';
}
window.openPanel = openPanel; //visible to html

//set the width of the sidebar to 0
export function closePanel() {
    document.getElementById('cheeseSidePanel').style.width = "0";
}
window.closePanel = closePanel;

//draggable, resizable + stackable panels 
const panes = document.querySelectorAll('.sidepanel');

let z = 1000

panes.forEach(pane => {
    //add a draggable, listen to the mouse down
    const title = pane.querySelector('.panel-image');

    title.addEventListener('mousedown', (event) => {
        pane.classList.add('is-dragging')

        pane.style.right = 'auto';

        let l = pane.offsetLeft;
        let t = pane.offsetTop;

        let startX = event.pageX; //where we just clicked
        let startY = event.pageY;

        const drag = (event) => {
            event.preventDefault();
            pane.style.left = l + (event.pageX - startX) + 'px';
            pane.style.top = t + (event.pageY - startY) + 'px';//px for updating pixels
        };
        const mouseUp = () => {
            pane.classList.remove('is-dragging')

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', mouseUp);
        };
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', mouseUp);

    });

    const resizeBar = pane.querySelector('.resize-bar');

    if (resizeBar) {
        resizeBar.addEventListener('mousedown', (event) => {
            event.preventDefault();

            const startX = event.clientX;
            const startWidth = pane.offsetWidth;

            const drag = (event) => {
                const deltaX = startX - event.clientX;
                const newWidth = startWidth + deltaX;

                pane.style.width = Math.max(250, newWidth) + 'px';
            };

            const mouseUp = () => {
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', mouseUp);
            };

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', mouseUp);
        })
    }

});

export function resetPanelPosition(panes) {
        panes.style.left = '';
        panes.style.top = '';
        panes.style.right = '0';
}




