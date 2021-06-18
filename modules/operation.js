var actualGameboard = [];
var history = [[]];
var actualIndex = 0;
for (var i = 0; i < 30; i++) {
  actualGameboard.push([]);
  history[0].push([]);
  for (var j = 0; j < 14; j++) {
    actualGameboard[i].push(0);
    history[0][i].push(0);
  }
}

export class Operations {
  static addBlocks(toAdd, canv) {
    let block = canv.id;
    let i = block.indexOf("X");
    let x = parseInt(block.substr(0, i));
    let y = parseInt(block.substr(i + 1));
    for (var j = 0; j < toAdd.length; j++) {
      let X = toAdd[j][0];
      let Y = toAdd[j][1];
      actualGameboard[Y][X] = [x, y];
      let c = document.getElementById(X + "X" + Y);
      let img = document.getElementById("spritesheet");
      var ctx = c.getContext("2d");
      ctx.drawImage(img, x, y, 32, 16, 0, 0, 32, 16);
      c.style.border = "1px dashed white";
    }
    if (actualIndex == history.length - 1) {
      history.push(JSON.parse(JSON.stringify(actualGameboard)));
      actualIndex++;
    } else if (actualIndex < history.length - 1) {
      history.splice(actualIndex + 1);
      history.push(JSON.parse(JSON.stringify(actualGameboard)));
      actualIndex++;
    }
  }
  static deleteBlock(toDelete) {
    for (var j = 0; j < toDelete.length; j++) {
      let X = toDelete[j][0];
      let Y = toDelete[j][1];
      actualGameboard[Y][X] = 0;
      let c = document.getElementById(X + "X" + Y);
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, 32, 16);
      c.style.border = "1px dashed white";
    }
    if (actualIndex == history.length - 1) {
      history.push(JSON.parse(JSON.stringify(actualGameboard)));
      actualIndex++;
    } else if (actualIndex < history.length - 1) {
      history.splice(actualIndex + 1);
      history.push(JSON.parse(JSON.stringify(actualGameboard)));
      actualIndex++;
    }
  }
  static undo() {
    if (actualIndex > 0) actualIndex--;
    Operations.generateMap(history[actualIndex]);
  }
  static redo() {
    if (actualIndex < history.length - 1) actualIndex++;
    Operations.generateMap(history[actualIndex]);
  }
  static saveToFile() {
    const json = JSON.stringify({
      actualGameboard,
    });

    const a = document.createElement("a");
    const file = new Blob([json], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "generatedMap.txt";
    a.click();
  }
  static loadFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = () => {
      if (!input?.files[0]) return;
      const file = input.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
          actualGameboard = JSON.parse(JSON.stringify(JSON.parse(e.currentTarget.result).actualGameboard))
          if (actualIndex == history.length - 1) {
            history.push(JSON.parse(JSON.stringify(actualGameboard)));
            actualIndex++;
          } else if (actualIndex < history.length - 1) {
            history.splice(actualIndex + 1);
            history.push(JSON.parse(JSON.stringify(actualGameboard)));
            actualIndex++;
          }
          Operations.generateMap(actualGameboard)
      };
      fileReader.readAsText(file);
    };
  }
  static generateMap(map) {
    for (var i = 0; i < 30; i++) {
      for (var j = 0; j < 14; j++) {
        if (map[i][j] == 0) {
          let c = document.getElementById(j + "X" + i);
          var ctx = c.getContext("2d");
          ctx.clearRect(0, 0, 32, 16);
          c.style.border = "1px dashed white";
          actualGameboard[i][j] = 0;
        } else {
          let x = map[i][j][0];
          let y = map[i][j][1];
          let c = document.getElementById(j + "X" + i);
          let img = document.getElementById("spritesheet");
          var ctx = c.getContext("2d");
          ctx.drawImage(img, x, y, 32, 16, 0, 0, 32, 16);
          c.style.border = "1px dashed white";
          actualGameboard[i][j] = [x, y];
        }
      }
    }
  }
}
