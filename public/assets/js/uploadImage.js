//select profile update image reference
const updateAvatarInput = document.querySelector("#updateAvatarInput");
const coverUpdateInput = document.querySelector("#coverUpdateInput");

const avatarPreview = document.querySelector("#avatarPreview");
const coverPreview = document.querySelector("#coverPreview");

const avatarUpdateBtn = document.querySelector("#avatarUpdateBtn");
const coverUpdateBtn = document.querySelector("#coverUpdateBtn");

//global variable
let imgCropper;

//update image functionality

function updateImages(imgInp, imgRatio, imgPreview) {
  imgInp.addEventListener("change", function (e) {
    const files = this.files;
    [...files].forEach((file) => {
      // toasts error
      const fileSizeLimitError = Toastify({
        text: "File is too large",
        duration: 4000,
      });
      const fileTypeLimitError = Toastify({
        text: "Only jpeg, jpg, png, svg file is allowed",
        duration: 4000,
      });
      if (
        !["image/png", "image/jpg", "image/jpeg", "images/svg+xml"].includes(
          file.type
        )
      ) {
        return fileTypeLimitError.showToast();
      }
      if (file.size > 1000000) {
        return fileSizeLimitError.showToast();
      }
    });

    if (files && files[0]) {
      const fr = new FileReader();
      fr.onload = function (e) {
        imgPreview.src = e.target.result;
        imgCropper = new Cropper(imgPreview, {
          aspectRatio: imgRatio,
          background: false,
        });
      };
      fr.readAsDataURL(files[0]);
    } else {
      console.log("OPPS!!");
    }
  });
}
//update avatar profile
updateImages(updateAvatarInput, 1 / 1, avatarPreview);

avatarUpdateBtn.addEventListener("click", function (e) {
  // toasts error
  const imageSelectError = Toastify({
    text: "Please select a image",
    duration: 4000,
  });

  const canvas = imgCropper?.getCroppedCanvas();

  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateAvatarInput?.files[0]?.name;
      const formData = new FormData();

      formData.append("avatar", blob, fileName);

      const url = `${window.location.origin}/profile/avatar`;

      fetch(url, { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    return imageSelectError.showToast();
  }
});

//update cover image
updateImages(coverUpdateInput, 16 / 9, coverPreview);

//cover img handler
coverUpdateBtn.addEventListener("click", function (e) {
  // console.log("click");
  // toasts error
  const imageSelectError = Toastify({
    text: "Please select a image",
    duration: 4000,
  });

  const canvas = imgCropper?.getCroppedCanvas();
  // console.log(canvas);
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = coverUpdateInput?.files[0]?.name;
      console.log(fileName);
      const formData = new FormData();

      formData.append("cover", blob, fileName);
      // return console.log(formData);
      const url = `${window.location.origin}/profile/cover`;

      fetch(url, { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    return imageSelectError.showToast();
  }
});
