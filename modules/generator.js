"use strict"
var toSend = []
import {
    Operations
} from "./operation.js"
export class Blocks {
    static createBlocks() {
        let x = 20
        let y = 864
        for (var i = 0; i < 3; i++) {
            let row = document.createElement("div")
            row.style.display = "flex"
            row.style.width = "160px"
            // row.classList.add("center")
            for (var j = 0; j < 5; j++) {
                let canv = document.createElement("canvas")
                canv.width = "32"
                canv.height = "16"
                canv.style.border = "1px dashed white"
                canv.style.cursor = "pointer"
                let img = document.getElementById("spritesheet")
                var ctx = canv.getContext('2d');
                ctx.drawImage(img, x, y, 32, 16, 0, 0, 32, 16);
                canv.id = x + "X" + y
                x += 40
                canv.addEventListener("click", () => {
                    if (toSend.length != 0)
                        Operations.addBlocks(toSend, canv)
                    toSend = []
                }, true)
                row.appendChild(canv)
            }
            document.getElementById("bloczki").appendChild(row)
            y += 20
            x = 20
        }
        document.onkeydown = (event) => {
            event.preventDefault()
            if (event.ctrlKey && event.code == "KeyZ") {
                Operations.undo()
            } else if (event.ctrlKey && event.code == "KeyY") {
                Operations.redo()
            } else if (event.ctrlKey && event.code == "KeyS") {
                Operations.saveToFile()
            } else if (event.ctrlKey && event.code == "KeyL") {
                Operations.loadFromFile()
            }
            if (event.metaKey && event.code == "KeyZ") {
                Operations.undo()
            } else if (event.metaKey  && event.code == "KeyY") {
                Operations.redo()
            } else if (event.metaKey  && event.code == "KeyS") {
                Operations.saveToFile()
            } else if (event.metaKey  && event.code == "KeyL") {
                Operations.loadFromFile()
            }
        }
    }


    static createGameboard() {
        for (var i = 0; i < 30; i++) {
            let row = document.createElement("div")
            row.style.display = "flex"
            row.style.width = "160px"
            // row.classList.add("center")
            for (var j = 0; j < 14; j++) {
                let canv = document.createElement("canvas")
                canv.width = "32"
                canv.height = "16"
                canv.style.border = "1px dashed white"
                row.appendChild(canv)
                canv.id = j + "X" + i
                canv.onclick = Blocks.addToSend
            }
            document.getElementById("plansza").appendChild(row)
        }
        document.body.onmousedown = (event) => {
            document.getElementById("zaznacz").style.width = "0px"
            Blocks.marking(event)
        }
        document.body.oncontextmenu = (event) => {
            event.preventDefault()
            document.getElementById("overlay").style.display = "block"
            let rect = document.getElementById("menu")
            rect.style.top = event.pageY + "px"
            rect.style.left = event.pageX + "px"
            var menuElements = document.getElementsByClassName("menuElement")
            for (let i = 0; i < menuElements.length; i++) {
                menuElements[i].onclick = () => {
                    document.getElementById("overlay").style.display = "none"
                    if (menuElements[i].children[0].innerHTML == "Undo") {
                        Operations.undo()
                    } else if (menuElements[i].children[0].innerHTML == "Redo") {
                        Operations.redo()
                    } else if (menuElements[i].children[0].innerHTML == "Save to file") {
                        Operations.saveToFile()
                    } else if (menuElements[i].children[0].innerHTML == "Load file") {
                        Operations.loadFromFile()
                    } else if (menuElements[i].children[0].innerHTML == "Delete") {
                        if (toSend.length != 0)
                            Operations.deleteBlock(toSend)
                    }
                    toSend = []
                }
            }
            document.body.onclick = () => {
                document.getElementById("overlay").style.display = "none"
            }
        }
        for (var i = 0; i < 30; i++) {
            for (var j = 0; j < 14; j++) {
                document.getElementById(j + "X" + i).onclick = Blocks.addToSend
            }
        }
    }


    static addToSend() {
        let s = this.id.indexOf("X")
        let x = parseInt(this.id.substr(0, s))
        let y = parseInt(this.id.substr(s + 1))
        let arr = [parseInt(x), parseInt(y)]
        let howMany = 0
        for (var i = 0; i < toSend.length; i++) {
            let current = toSend[i]
            if (current[0] == arr[0] && current[1] == arr[1]) {
                howMany = 1
                toSend.splice(i, 1)
                this.style.border = "1px dashed white"
            }
        }
        if (howMany == 0) {
            toSend.push(arr);
            this.style.border = "1px dashed red"
        }
        if (toSend.length == 0) {
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 14; j++) {
                    document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                }
            }
        } else {
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 14; j++) {
                    if (document.getElementById(j + "X" + i).style.border == "1px dashed white")
                        document.getElementById(j + "X" + i).onclick = ''
                }
            }
            document.body.onkeydown = function (event) {
                if (event.code == "ControlLeft" || event.code == "MetaLeft") {
                    for (var i = 0; i < 30; i++) {
                        for (var j = 0; j < 14; j++) {
                            document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                        }
                    }
                }
                if (event.code == "Delete") {
                    Operations.deleteBlock(toSend)
                    toSend = []

                    for (var i = 0; i < 30; i++) {
                        for (var j = 0; j < 14; j++) {
                            document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                        }
                    }
                }
            }
            document.body.onkeyup = function (event) {
                if (event.code == "ControlLeft" || event.code == "MetaLeft") {
                    for (var i = 0; i < 30; i++) {
                        for (var j = 0; j < 14; j++) {
                            if (document.getElementById(j + "X" + i).style.border == "1px dashed white")
                                document.getElementById(j + "X" + i).onclick = ''
                        }
                    }
                }
                if (event.code == "Delete") {
                    for (var i = 0; i < 30; i++) {
                        for (var j = 0; j < 14; j++) {
                            document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                        }
                    }
                }
            }
        }
    }


    static marking(event) {
        let startX = event.pageX
        let startY = event.pageY
        let currentX, currentY
        let coat = document.getElementById("zaznacz")
        coat.style.left = startX + "px"
        coat.style.top = startY + "px"
        coat.style.display = "block"
        let coords = [];
        var selected = [];
        for (var i = 0; i < 30; i++) {
            coords.push([])
            for (var j = 0; j < 14; j++) {
                let rect = document.getElementById(j + "X" + i).getBoundingClientRect();
                let x = rect.left
                let y = rect.top
                coords[i].push([x, y])
            }
        }
        document.body.onmousemove = (e) => {
            currentX = e.pageX
            currentY = e.pageY
            selected = []
            let notSelected = []
            if (currentX - startX >= 0) {
                coat.style.left = startX + "px"
                coat.style.width = (currentX - startX) + "px"
            } else {
                coat.style.left = currentX + "px"
                coat.style.width = Math.abs(currentX - startX) + "px"
            }
            if (currentY - startY >= 0) {
                coat.style.height = (currentY - startY) + "px"
                coat.style.top = startY + "px"
            } else {
                coat.style.top = currentY + "px"
                coat.style.height = Math.abs(currentY - startY) + "px"
            }
            let divX = parseFloat(coat.style.left.substring(0, coat.style.left.length - 2))
            let divY = parseFloat(coat.style.top.substring(0, coat.style.top.length - 2))
            let divWidth = parseFloat(coat.style.width.substring(0, coat.style.width.length - 2))
            let divHeight = parseFloat(coat.style.height.substring(0, coat.style.height.length - 2))
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 14; j++) {
                    let x = coords[i][j][0]
                    let y = coords[i][j][1]
                    if (x > divX - 32 && x <= divWidth + divX && y > divY - 16 && y <= divHeight + divY) {
                        selected.push([j, i])
                        document.getElementById(j + "X" + i).style.border = "1px dashed red"
                    } else {
                        function isArrayInArray(arr, item) {
                            var item_as_string = JSON.stringify(item);

                            var contains = arr.some(function (ele) {
                                return JSON.stringify(ele) === item_as_string;
                            });
                            return contains;
                        }
                        if (!isArrayInArray(toSend, [j, i])) {
                            document.getElementById(j + "X" + i).style.border = "1px dashed white"
                        } else {
                            document.getElementById(j + "X" + i).style.border = "1px dashed red"
                        }
                    }
                }
            }
        }
        document.body.onmouseup = () => {
            document.body.onmouseup = ''
            document.getElementById("zaznacz").style.width = "0px"
            document.getElementById("zaznacz").style.display = "none"
            document.body.onmousemove = ''
            document.body.onscroll = ''
            Blocks.select(selected)
            selected = []
            if (toSend.length > 0) {
                document.body.onkeydown = function (event) {
                    if (event.code == "ControlLeft" || event.code == "MetaLeft") {
                        for (var i = 0; i < 30; i++) {
                            for (var j = 0; j < 14; j++) {
                                document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                            }
                        }
                    }
                    if (event.code == "Delete") {
                        Operations.deleteBlock(toSend)
                        toSend = []
                        for (var i = 0; i < 30; i++) {
                            for (var j = 0; j < 14; j++) {
                                document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                            }
                        }
                    }
                }
                document.body.onkeyup = function (event) {
                    if (event.code == "ControlLeft" || event.code == "MetaLeft") {
                        for (var i = 0; i < 30; i++) {
                            for (var j = 0; j < 14; j++) {
                                if (document.getElementById(j + "X" + i).style.border == "1px dashed white")
                                    document.getElementById(j + "X" + i).onclick = ''
                            }
                        }
                    }
                    if (event.code == "Delete") {
                        for (var i = 0; i < 30; i++) {
                            for (var j = 0; j < 14; j++) {
                                document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                            }
                        }
                    }
                }
            } else if (toSend.length == 0) {
                for (var i = 0; i < 30; i++) {
                    for (var j = 0; j < 14; j++) {
                        document.getElementById(j + "X" + i).onclick = Blocks.addToSend
                    }
                }
            }
        }
    }


    static select(selected) {
        for (let i = 0; i < selected.length; i++) {
            toSend.push(selected[i])
        }
    }
}