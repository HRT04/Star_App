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

    // キャンバスから切り取った画像データを取得
    const capturedImageData = ctx2.getImageData(
      0,
      0,
      objectWidth,
      objectHeight
    );

    // 切り取った画像をOpenCVのMat形式に変換
    const img_mat = cv.matFromImageData(capturedImageData);

    // Mat形式の画像のsize
    console.log(`row:${img_mat.rows}, col:${img_mat.cols}`);

    // color.jsのColor_processを使用 (引数 : img_mat)
    Color_process.setValue(img_mat);
    // getValue()で値を取得
    const result = Color_process.getValue();
    // console表示
    console.log("Received value:", result);

    console.log("commit_4");
  });
}
