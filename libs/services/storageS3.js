import * as AWS from "aws-sdk";
import mLog from "utils/mLog";
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCES_KEY_AWS_ID,
    secretAccessKey: process.env.ACCES_KEY_AWS_SECRET
  }
});
AWS.config.update({
  secretAccessKey: process.env.ACCES_KEY_AWS_SECRET,
  accessKeyId: process.env.ACCES_KEY_AWS_ID,
  region: process.env.REGION
});

export function storageS3(imageBase64) {
  try {
    let imageUrl = "";

    let params = {
      Bucket: "musicout-bucket",
      Key: "",
      Body: "",
      ContentEncoding: process.env.ENCODING_TYPE,
      ACL: "public-read"
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
      } else {
        mLog(
          `Successfully uploaded data to ${params.Bucket}/${params.Key}`,
          "blue"
        );
      }
    });
    return imageUrl;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
}
