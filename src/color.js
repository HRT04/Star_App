//camera.jsから読み込まれる
// mat_dataには切り取った画像をmat形式に変換したデータが引数として渡される

const Color_process = {
  value: null,
  setValue: function (mat_data) {
    const hsv = new cv.Mat();
    cv.cvtColor(mat_data, hsv, cv.COLOR_RGB2HSV_FULL);
    // console.log(hsv);

    let srcVec = new cv.MatVector();
    srcVec.push_back(hsv);

    // Hueヒストグラムの計算
    const hist = new cv.Mat();
    const histSize = [180]; // ヒストグラムのサイズ
    const ranges = [0, 180]; // ヒストグラムの値の範
    const channels = [0];
    cv.calcHist(srcVec, channels, new cv.Mat(), hist, histSize, ranges, false);

    var maxIdx = hist.data32F.indexOf(Math.max(...hist.data32F));
    this.modeHue = maxIdx;

    // Saturationヒストグラムの計算
    const hist2 = new cv.Mat();
    const histSize2 = [256]; // ヒストグラムのサイズ
    const ranges2 = [0, 256]; // ヒストグラムの値の範
    const channels2 = [1];
    cv.calcHist(
      srcVec,
      channels2,
      new cv.Mat(),
      hist2,
      histSize2,
      ranges2,
      false
    );

    var maxIdy = hist2.data32F.indexOf(Math.max(...hist2.data32F));
    this.modeSatu = maxIdy;

    // Valueヒストグラムの計算
    const hist3 = new cv.Mat();
    const histSize3 = [256]; // ヒストグラムのサイズ
    const ranges3 = [0, 256]; // ヒストグラムの値の範
    const channels3 = [2];
    cv.calcHist(
      srcVec,
      channels3,
      new cv.Mat(),
      hist3,
      histSize3,
      ranges3,
      false
    );
    // Release memory
    var maxIdz = hist3.data32F.indexOf(Math.max(...hist3.data32F));
    this.modeValue = maxIdz;

    // Release memory
    mat_data.delete();
    hsv.delete();
    hist.delete();
    hist2.delete();
  },
  getValue: function () {
    // modeValueが30以下の時には黒, modeValueが30以上でmodeSatuが20以下の時は白
    // それ以外は

    // canvasに表示
    // cv.imshow(canvas, image);

    const Return_data = {
      modeHue: this.modeHue * 2,
      modeSatu: this.modeSatu,
      modeValue: this.modeValue,
    };

    return Return_data;
  },
};
