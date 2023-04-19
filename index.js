const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcme to ytdl, use /info and /download")
})

app.get("/info", async (req, res) => {
	if (req.query.URL === undefined) res.send("URL is undefined");
  ytdl.getInfo(req.query.URL).then(info => {
    res.send(info)
  })
});

app.get("/download", async (req, res) => {
  if (req.query.URL === undefined) res.send("URL is undefined");
  if(!(ytdl.validateURL(req.query.URL))) res.send("Invalid URL")
  try {
    ytdl.getInfo(req.query.URL).then(info => {
      const title = info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-');
      var extension = "mp4";
		  var video = ytdl.downloadFromInfo(info, { filter: req.query.filter });
		  if (req.query.filter == "audioonly") {
			  extension = "mp3";
		  }
		  res.header(
			  "Content-Disposition",
			  `attachment; filename="${title}.${extension}"`,
		  );
		  video.pipe(res);
    })
  } catch (error) {
    res.send(error)
  }
});

module.exports = app

// ytdl.getInfo(videoURL).then(info => {
//   const title = info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-');
//   ytdl.downloadFromInfo(info, { quality: 'highest' , filter: "audioandvideo"})
//     .pipe(fs.createWriteStream(`${title}.mp4`));
// })
