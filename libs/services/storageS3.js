import * as AWS from "aws-sdk";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCES_KEY_AWS_ID,
    secretAccessKey: process.env.ACCES_KEY_AWS_SECRET
  }
});
AWS.config.update({
  secretAccessKey: process.env.ACCES_KEY_AWS_SECRET,
  accessKeyId: process.env.ACCES_KEY_AWS_ID,
  region: "eu-west-3"
});

export function storageS3(imageBase64) {
  try {
    let imageUrl = "";

    let params = {
      Bucket: "musicout-bucket",
      Key: "",
      Body: "",
      ContentEncoding: "base64",
      ACL: "public-read",
      ContentType: "image/jpeg"
    };
    let bufferImage = Buffer.from(
      imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    //GET THE TYPE OF THE IMAGE
    const type = imageBase64.split(";")[0].split("/")[1];

    // the ImageName
    let imageName = Date.now().toString() + "." + type;

    //URL TO STORE IN DB
    imageUrl =
      "https://s3.eu-west-3.amazonaws.com/musicout-bucket/" + imageName;

    //PARAMS OF S3
    params.Key = imageName;
    params.Body = bufferImage;

    //PUT THE IMAGE IN AWS-S3

    s3.putObject(params, (err, data) => {
      if (err) {
        res.status(400).send(error.message);
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }
    });
    return imageUrl;
  } catch (error) {
    res.status(400).send(error);
  }
}
