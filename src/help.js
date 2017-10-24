function help()
{
    alert(`
# ALL
- press SPACE to switch between modes
- use your trackpad or drag your mouse around to move on the stage
- hold CTRL while scrolling to control zoom

# EDIT
- click on an empty space to start a new polygon
- click on the first point of a new polygon to close it
- click on an existing polygon edge to start editing it
- hold shift while drawing to build straight lines
- right click while editing to remove the last added point
- right click on a polygon point to remove it

# MOVE
- click on a polygon to select it
- right click anywhere to reset selection
- drag a selected polygon to move it on the stage
- hold CTRL while dragging a polygon to create a copy
- drag a selected polygon's point to change its position
- press DEL while a polygon is selected to remove it
    `)
}


export default help
