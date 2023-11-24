const script = document.createElement("script");
script.setAttribute("async", "");
script.setAttribute("onload", "onOpenCvReady();");
script.setAttribute("src", "https://docs.opencv.org/master/opencv.js");
document.head.appendChild(script);

function onOpenCvReady() {
  const cv = window.cv;

  const videoElement = document.getElementById("video-element");
  const captureButton = document.getElementById("capture-button");
  const processedImage = document.getElementById("processed-image");
  const imageOverlay = document.getElementById("image-overlay");

  // color.jsを読み込んだか判別
  let col_Load = false;

  // カメラの映像取得
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: { exact: "environment" } } })
    .then((stream) => {
      // 読み込み開始
      console.log("navi loaded.");
      videoElement.srcObject = stream;
      videoElement.play();
    })
    .then(() => {
      // 映像の再生が開始された後に showCaptureArea() を呼び出す
      videoElement.addEventListener("loadedmetadata", () => {
        // 読み込み完了
        console.log("Data loaded.");
        //videoElementの幅と高さを取得
        const videoWidth = videoElement.clientWidth;
        const videoHeight = videoElement.clientHeight;

        // 枠線の領域を指定(キャプチャ範囲のobjectWidt,objectHeightの2倍の範囲に設定する)
        const objectWidth = 400;
        const objectHeight = 400;

        // 切り取る領域の左上座標を計算
        const startX = (videoWidth - objectWidth) / 2;
        const startY = (videoHeight - objectHeight) / 2;
        // 枠線表示
        showCaptureArea(
          videoWidth,
          videoHeight,
          objectWidth,
          objectHeight,
          startX,
          startY
        );
      });
    })
    .catch((error) => {
      console.error("Video play error: ", error);
    });

  //枠線表示関数
  function showCaptureArea(vdW, vdH, ojW, ojH, stX, stY) {
    // キャンバスを作成
    const ctx1 = imageOverlay.getContext("2d");

    // キャンバスのサイズを設定
    imageOverlay.width = vdW;
    imageOverlay.height = vdH;

    // 枠線を描画
    ctx1.strokeStyle = "#FF0000"; // 赤色
    ctx1.beginPath();
    ctx1.strokeRect(stX, stY, ojW, ojH);
  }

  // キャプチャボタンのクリックイベント
  captureButton.addEventListener("click", () => {
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    // キャプチャした画像の領域を指定
    const objectWidth = 200;
    const objectHeight = 200;

    // 切り取る領域の左上座標を計算
    const startX = (videoWidth - objectWidth) / 2;
    const startY = (videoHeight - objectHeight) / 2;

    // キャンバスを作成し、映像を描画
    const canvas = document.createElement("canvas");
    canvas.width = objectWidth; // 切り取る領域の幅
    canvas.height = objectHeight; // 切り取る領域の高さ
    const ctx2 = canvas.getContext("2d");

    // キャンバス初期化
    ctx2.beginPath();
    // キャプチャした画像をクロップして描画
    ctx2.drawImage(
      videoElement,
      startX,
      startY,
      objectWidth,
      objectHeight,
      0,
      0,
      objectWidth,
      objectHeight
    );

    // キャンバスからデータURL形式で画像を取得
    const capturedImage = canvas.toDataURL();

    // 画像を表示
    processedImage.src = capturedImage;
    processedImage.style.display = "block";

    // キャンバスから画像データを取得
    const capturedImageData = ctx2.getImageData(
      0,
      0,
      objectWidth,
      objectHeight
    );

    // OpenCVのMat形式に変換
    const img_mat = cv.matFromImageData(capturedImageData);

    // mat形式の画像のsize
    console.log(img_mat.cols, img_mat.rows);

    // 1度目の読み込み
    if (!col_Load) {
      // 外部ファイル (color.js) を読み込む
      const script2 = document.createElement("script");
      // color.js のパスを指定 (自身の格納場所の絶対パスに書き換える...{相対パスで出来るようにしたい})
      script2.src = "/Users/a/AR/Star_app/src/color.js";
      // HTMLに追加
      document.head.appendChild(script2);

      // 外部ファイルが読み込まれた後に処理を実行
      script2.onload = function () {
        // color.jsのColor_processへimg_matを使用
        Color_process.setValue(img_mat);
        // getValue()で値を取得
        const result = Color_process.getValue();
        // console表示
        console.log("Received value:", result);
        col_Load = true;
      };
    } else {
      // 2回目以降
      Color_process.setValue(img_mat);
      const result = Color_process.getValue();
      console.log("Received value:", result);
    }
  });
}
