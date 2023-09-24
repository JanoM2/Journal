// import "setimmediate";
// import uploadImage from "@/modules/daybook/helper/uploadImage";
// import axios from "axios";
// import cloudinary from "cloudinary";

// cloudinary.config({
//   cloud_name: "dnoxyukzk",
//   api_key: "875384957133197",
//   api_secret: "cgHrA-rab1FX4qWTM3omxY6vzO0",
// });

// describe("Pruebas en el uploadImage", () => {
//   test("debe de cargar un archivo y retornar el url", async (done) => {
//     const { data } = await axios.get(
//       "https://res.cloudinary.com/dnoxyukzk/image/upload/v1667234811/samples/sheep.jpg",
//       { responseType: "arraybuffer" }
//     );

//     const file = new File([data], "foto.jpg");

//     const url = await uploadImage(file);

//     expect(typeof url).toBe("string");

//     const segments = url.split("/");
//     const imageId = segments[segments.length - 1].replace(".jpg", "");

//     cloudinary.v2.api.delete_resources(imageId, {}, () => {
//       done();
//     });
//     //
//   });
// });

describe("Este test debe de hacer nada", () => {
  test("hacer nada", () => {
    // // jest.setTimeout(10000);
  });
});
