//camera.jsから読み込まれる
// mat_dataには切り取った画像をmat形式に変換したデータが引数として渡される

const Color_process = {
  processValue: function (mat_data) {
    const hsv = new cv.Mat();

    // 平滑化処理
    const smooth_data = new cv.Mat();
    cv.GaussianBlur(
      mat_data,
      smooth_data,
      new cv.Size(9, 9),
      0,
      0,
      cv.BORDER_DEFAULT
    );

    // コントラスト強調
    const contrast_data = new cv.Mat();
    cv.convertScaleAbs(smooth_data, contrast_data, 4.0, 0);
    // console.log(hsv);
    cv.cvtColor(contrast_data, hsv, cv.COLOR_RGB2HSV_FULL);

    let srcVec = new cv.MatVector();
    srcVec.push_back(hsv);

    // Hueヒストグラムの計算
    const hist = new cv.Mat();
    const histSize = [180]; // ヒストグラムのサイズ
    const ranges = [0, 180]; // ヒストグラムの値の範囲
    const channels = [0];
    cv.calcHist(srcVec, channels, new cv.Mat(), hist, histSize, ranges, false);

    let maxIdx = hist.data32F.indexOf(Math.max(...hist.data32F));
    const modeHue = maxIdx;

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

    let maxIdy = hist2.data32F.indexOf(Math.max(...hist2.data32F));
    const modeSatu = maxIdy;

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
    let maxIdz = hist3.data32F.indexOf(Math.max(...hist3.data32F));
    const modeValue = maxIdz;

    // Release memory
    mat_data.delete();
    smooth_data.delete();
    hsv.delete();
    hist.delete();
    hist2.delete();

    const Return_data = {
      modeHue: modeHue * 2, // 色相
      modeSatu: modeSatu, // 彩度
      modeValue: modeValue, // 明度
    };
    return Return_data;
  },
};
