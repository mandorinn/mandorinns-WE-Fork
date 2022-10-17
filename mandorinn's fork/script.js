//Constant variables
const name = "walltaker-wallpaper-engine";
const vNr_str = "v1.2.0";

//all area names
const areas = [
  "none",
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
  "canvas",
];

//all reactions
const reacts = {
  "": "[]",
  disgust: "😓",
  horny: "😍",
  came: "💦",
};

const reactions = {
  standard: [
    "I like this one",
    "I don't like this one",
    "That's a nice one!",
    "I love it!",
    "Great!",
    "Nice",
    "Cute!",
    "More!",
    "Thank you!",
    "Next one please",
    "YES!",
    "Please?",
    "Already had that one",
  ],
  emojis: [
    "👀",
    "😣",
    "😋",
    "👍",
    "😁",
    "😶",
    "😓",
    "🤨",
    "😖",
    "🙁",
    "🫤",
    "😟",
    "😵‍💫",
    "🥺",
    "😯",
    "🤤",
    "😭",
    "🤯",
    "🙂",
  ],
  lycraons: [":3", "X3", ":)", ":/", ":(", "=3"],
  emoticons: [
    "°ω°",
    "^ω^",
    "0ω0",
    "0ω*",
    "ฅ^•ﻌ•^ฅ",
    "U'ᴥ'U",
    "(ʋ◕ᴥ◕)",
    "∪･ω･∪",
  ],
  custom: [" ", " ", " ", " ", " ", " "],
};

//Settings
var settings = {
  overrideURL: "", // Put an Url here to only show this url (must be link to picture/video (static pages on e621))
  volume: "1",
  linkID: "",
  api_key: "",
  textColor: "255 255 255",
  "background-color": "0 0 0",
  "background-opacity": "1",
  fontSize: "100%", //x-small,small, medium, large or px / em / %
  interval: "10000", //ms do not run with small numbers(<1000) for long sessions
  autoResponseInt: "1800000", //ms do not run with small numbers(<10000) for long sessions
  masterPersona: "like",
  objFit: "contain",
  textPos: "top-left",
  reactPos: "top-center",
  reactPacks: [], //! only use strings ! !overrides WE settings!
  //'reactPacks': "",
  showTooltips: "true",
  showSetterData: "true",
  listSetterLinks: "true",
  responsePos: "top-center",
  setterInfoPos: "bottom-left",
  maxAreaWidth: "20vw",
  zoom_w: "100", //%
  zoom_h: "100", //%
  canv_x: "0", //px
  canv_y: "0", //px
};

//Global variables
var lastUrl = "";
var lastSetBy = "";
var lastResponseType = "";
var lastResponseText = "";
var lastCanvas = "";

var reactPacks = [];

var Url = "";
var overrideUpdate = false;
var bOpacity = settings["background-opacity"];

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    var reloadCanvas = false;
    var realoadSetter = false;

    if (properties.vid_volume) {
      settings["volume"] = properties.vid_volume.value;
    }

    if (properties.linkID) {
      settings["linkID"] = properties.linkID.value;
      lastUrl = "";
      getJSON();
    }

    if (properties.api_key) {
      settings["api_key"] = properties.api_key.value;

      if (!settings["api_key"].length == 8) {
        settings["reactPos"] = "none";
        settings["responsePos"] = "none";
      }
      reloadCanvas = true;
    }

    if (properties.interval)
      settings["interval"] = parseInt(properties.interval.value) * 1000;

    if (properties.autoResponseInt)
      settings["autoResponseInt"] =
        parseInt(properties.autoResponseInt.value) * 60000;

    if (properties.moods) {
      settings["masterPersona"] = properties.moods.value;
    }
    if (properties.objfit) {
      settings["objFit"] = properties.objfit.value;
      reloadCanvas = true;
    }

    if (properties.backg_color)
      settings["background-color"] = properties.backg_color.value;

    if (properties.text_color)
      settings["textColor"] = properties.text_color.value;

    if (properties.area_maxWidth)
      settings["maxAreaWidth"] = properties.area_maxWidth.value + "vw";

    if (properties.font_size) settings["fontSize"] = properties.font_size.value;

    if (properties.noVideo) settings["noVideo"] = properties.noVideo.value;

    if (properties.set_by) {
      settings["textPos"] = properties.set_by.value;
      reloadCanvas = true;
    }

    if (properties.setterData) {
      settings["showSetterData"] = "" + properties.setterData.value + "";
      reloadCanvas = true;
    }

    if (properties.setterLinks) {
      settings["listSetterLinks"] = "" + properties.setterLinks.value + "";
      realoadSetter = true;
    }

    if (properties.setterInfo) {
      settings["setterInfoPos"] = properties.setterInfo.value;
      reloadCanvas = true;
    }

    if (properties.reaction) {
      settings["reactPos"] = properties.reaction.value;
      settings["responsePos"] = properties.reaction.value;
      reloadCanvas = true;
    }

    if (properties.zoom_w) settings["zoom_w"] = properties.zoom_w.value;

    if (properties.zoom_h) settings["zoom_h"] = properties.zoom_h.value;

    if (properties.canv_x) settings["canv_x"] = properties.canv_x.value;

    if (properties.canv_y) settings["canv_y"] = properties.canv_y.value;

    if (properties.customreactions) {
      if (properties.customreactions.value == true) reactPacks.push("custom");
      else reactPacks = reactPacks.filter((x) => x !== "custom");
      reloadCanvas = true;
    }

    if (properties.standardreactions) {
      if (properties.standardreactions.value == true)
        reactPacks.push("standard");
      else reactPacks = reactPacks.filter((x) => x !== "standard");
      reloadCanvas = true;
    }

    if (properties.lycraonsreactions) {
      if (properties.lycraonsreactions.value == true)
        reactPacks.push("lycraons");
      else reactPacks = reactPacks.filter((x) => x !== "lycraons");
      reloadCanvas = true;
    }

    if (properties.emoticonreactions) {
      if (properties.emoticonreactions.value == true)
        reactPacks.push("emoticons");
      else reactPacks = reactPacks.filter((x) => x !== "emoticons");
      reloadCanvas = true;
    }

    if (properties.emojireactions) {
      if (properties.emojireactions.value == true) reactPacks.push("emojis");
      else reactPacks = reactPacks.filter((x) => x !== "emojis");
      reloadCanvas = true;
    }

    if (properties.reaction1) {
      reactions["custom"][0] = properties.reaction1.value;

      reloadCanvas = true;
    }

    if (properties.reaction2) {
      reactions["custom"][1] = properties.reaction2.value;

      reloadCanvas = true;
    }

    if (properties.reaction3) {
      reactions["custom"][2] = properties.reaction3.value;

      reloadCanvas = true;
    }

    if (properties.reaction4) {
      reactions["custom"][3] = properties.reaction4.value;

      reloadCanvas = true;
    }

    if (properties.reaction5) {
      reactions["custom"][4] = properties.reaction5.value;

      reloadCanvas = true;
    }

    if (properties.reaction6) {
      reactions["custom"][5] = properties.reaction6.value;

      reloadCanvas = true;
    }

    if (settings["overrideURL"]) ChangeSettings();

    if (reloadCanvas) {
      overrideUpdate = true;
      getJSON();
    } else ChangeSettings();

    if (realoadSetter) UpdateSetterInfo(lastSetBy);
  },
};

//start Checks for Updates when page loaded
window.onload = function () {
  document.getElementById("bImg").style.visibility = "visible";
  if (settings["overrideURL"]) setCustomUrl(settings["overrideURL"]);
  else if (!UpdateCanvasRunning) UpdateCanvas();

  console.log("window loaded!");
};

function setCustomUrl(url) {
  lastUrl = url;
  ChangeSettings();
  console.log("custom url " + settings["overrideURL"]);
  var str = "";
  str += getBgHtml(url);

  console.log(str);

  document.getElementById("canvas").innerHTML = str;

  settings["showTooltips"] = false;
  setEvents();

  ChangeSettings();
}

//changes Settings mostly CSS stuff
function ChangeSettings() {
  var color = settings["background-color"] + " " + bOpacity;
  var css = "";

  //*
  css += "* {\n";
  css += "	font-size: " + settings["fontSize"] + ";\n";
  css += "}\n\n";

  //body
  css += "body {\n";
  css += "	background-color: " + GetRGBColor(color) + "!important;\n";
  css += "}\n\n";

  //.areas
  css += ".area{\n";
  css += "	max-width: " + settings["maxAreaWidth"] + ";\n";
  css += "}\n\n";

  //.texts
  css += ".text{\n";
  css += "	color:" + GetRGBColor(settings["textColor"]) + ";\n";
  css += "}\n\n";

  //#canvas
  css += "#canvas {\n";
  css += "	width: " + settings["zoom_w"] + "% !important;\n";
  css += "	height: " + settings["zoom_h"] + "% !important;\n";
  css += "	margin-top: " + settings["canv_y"] + "% !important;\n";
  css += "	margin-left: " + settings["canv_x"] + "% !important;\n";
  css += "}\n\n";

  //bImg
  css += ".bImg {\n";
  css += "	background-repeat: no-repeat;\n";
  css += "	object-fit:" + settings["objFit"] + "!important;\n";
  css += "	position: absolute;\n";

  if (lastUrl) {
    css += "	content:url(" + lastUrl + ");\n";
  } else css += "	content:url();\n";

  css += "}\n\n";

  /* Removes/Adds Video Volume Controls */
  /* For Some reason I can't get rid of the hover effect blehhhhhh */
  if (settings["noVideo"] === true) {
    css += `video::-webkit-media-controls-volume-slider {width: 0; height: 0; display: none; pointer-events:none;}
            video::-webkit-media-controls-volume-slider::hover {opacity: 0;}
            video::-webkit-media-controls-mute-button {display: none; pointer-events:none;}
            video::-webkit-media-controls-fullscreen-button {display: none; pointer-events:none;}`;
  } else {
  }

  //setting content of dynCSS (style element)
  document.getElementById("dynCSS").innerHTML = css;
}

//takes WallpaperEngine color string and converts it into (usable) rgb/rgba format
function GetRGBColor(customColor) {
  //split string into values
  var temp = customColor.split(" ");
  var rgb = temp.slice(0, 3);

  //cap rgb values at 255
  rgb = rgb.map(function _cap(c) {
    return Math.ceil(c * 255);
  });

  var customColorAsCSS = "";

  //length is 3 for rgb values
  if (temp.length > 3) customColorAsCSS = "rgba(" + rgb + "," + temp[3] + ")";
  else customColorAsCSS = "rgb(" + rgb + ")";

  return customColorAsCSS;
}

//sends POST to Website and passes data to setNewPost
function postReaction(reactType) {
  if (settings["api_key"].length == 8) {
    //Reaction Text
    var txt = "";

    if (reactPacks.length > 0)
      txt = document.getElementById("btn_reactDD_value").innerHTML;

    console.log(
      "Posting reaction (" +
        reactType +
        "," +
        txt +
        ") to Link " +
        settings["linkID"]
    );

    //POST
    $.ajax({
      type: "POST",
      url:
        "https://walltaker.joi.how/api/links/" +
        settings["linkID"] +
        "/response.json",
      data: JSON.stringify({
        api_key: settings["api_key"],
        type: "" + reactType + "",
        text: txt,
      }),
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        overrideUpdate = true;
        setNewPost(data);
      },
      failure: function (errMsg) {},
    });
  }
}

const autoReactions = {
  like: ["=3", "^ω^", "OωO", "Nice!", "ฅ^•ﻌ•^ฅ", "Thank you!", "x3", "uwu"],
  dom: [
    "Looks like my wh*re didn't tell you how much they liked your wallpaper, sorry about that~",
    "I need to teach this one to rate the wallpapers you kind strangers set...",
    "My little toy may not have rated your wallpaper, but I can assure you they loved it~",
    "Looks like this slut was too 'shy' to rate your wallpaper, they're 𝘷𝘦𝘳𝘺 much enjoying it.",
    "I can't tell if my wh*re is being bratty by not rating wallpapers, or if their head is just that empty?",
    "Sorry for the wait, this b*tch has been too busy masturbating to rate your wallpaper~",
    "My wh*re has been very much enjoying this wallpaper, they want me to thank you~",
    "This wallpaper has made my b*tch get their chair all wet, thanks~",
  ],
  owner: [
    "My pet has been taking a lil' nap so they haven't rated yet, sorry!",
    "My pet hasn't been able to stop staring at your wallpaper, it's very cute! x3c",
    "Sorry! I was busy teaching my pet a new trick so I couldn't rate this for them quickly~",
    "You wouldn't believe how cute my pet is when they're pawing off! Thanks! x3c",
    "My pet has been enjoying your wallpaper a lot! Keep them coming!",
    "Sorry for the late rating! I'm still trying to teach my pet how to use a computer!",
    "My pet has been absolutely 𝘴𝘰𝘢𝘬𝘦𝘥 thanks to your wallpaper! x3",
    "Oops! I really need to make sure my pet rates the wallpapers that are set!",
  ],
  funny: [
    "🤖: Is that much drool normal? I don't think that much drool is normal.",
    "🤖: Uhhh, you probably wouldn't believe the reason why they haven't rated this wallpaper yet.",
    "🤖: Holy SHIT, that was such a close call! They're playing Metal Gear with yiff I swear!",
    "🤖: Why haven't rated this yet? Should we call someone for help?",
    "🤖: Soooo, this hasn't been rated yet because a certain someone is in a bit of a 𝘴𝘵𝘪𝘤𝘬𝘺 situation.",
    "🤖: Di- Did they really just fall asleep while looking at porn???",
    "🤖: Oop, seems like they got distracted by a 4 hour Youtube video about a game they haven't played, RIP.",
    "🤖: Seems like they got a little too overzealous while having fun, that looks like it hurt!",
  ],
  none: [
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
    "Sorry! I must be busy and can't rate wallpapers at the moment!",
  ],
};

function getRandomResponse() {
  let num = Math.floor(Math.random() * 8);
  return autoReactions[settings["masterPersona"]][num];
}

function autoPost() {
  $.ajax({
    type: "POST",
    url: "https://walltaker.joi.how/api/links/" + "1945" + "/response.json",
    data: JSON.stringify({
      api_key: settings["api_key"],
      type: "horny",
      text: "" + getRandomResponse() + "",
    }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      overrideUpdate = true;
      setNewPost(data);
    },
    failure: function (errMsg) {},
  });
}

async function autoRate() {
  const autoUrl =
    "https://walltaker.joi.how/api/links/" +
    "1945" +
    ".json" +
    "?api_key=" +
    settings["api_key"];
  const autoResponse = await fetch(autoUrl);
  const curRat = await autoResponse.json();
  const currentRating = curRat.response_type;
  if (currentRating === null) {
    autoPost();
  } else {
  }
}
timer = setInterval(autoRate, settings["autoResponseInt"]);

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(autoRate, settings["autoResponseInt"]);
}

function setNewPost(data) {
  if (settings["overrideURL"]) return;
  //Check for changes if false skip code
  //this is for perfomance (local & network)
  if (
    (data && lastUrl != data.post_url) ||
    data.response_type != lastResponseType ||
    data.response_text != lastResponseText ||
    overrideUpdate == true
  ) {
    //set in case override was true
    overrideUpdate = false;
    console.log("Updating link data!");

    if (data.post_url && data.post_url != "") {
      bOpacity = settings["background-opacity"];
      //bg += getBgHtml(data.post_url);

      var filetype = data.post_url.split(".").pop();

      document.getElementById("bImg").style.visibility = "visible";
      document.getElementById("bVid").style.visibility = "hidden";
      document.getElementById("bVid").src = data.post_url;

      while (document.getElementById("temp"))
        document.getElementById("temp").remove();

      var img = document.createElement("Img");
      img.style.visibility = "hidden";

      img.src = data.post_url;
      img.id = "temp";

      /* Resets auto response timer */
      resetTimer();

      document.body.appendChild(img);
      /*
						if(lastUrl != data.post_url){
							bg += '<Img id="bImg" class="bImg" src="'+data.post_url+'" visibility="hidden"/>';
							bg += '<video id="bVid" class="bImg" src="'+data.post_url+'" visibility="hidden" autoplay loop> Error on loading Video</video>';					
						}else{
							bg += '<Img id="bImg" class="bImg" src="'+data.post_url+'" visibility="visible"/>';
							bg += '<video id="bVid" class="bImg" src="'+data.post_url+'" visibility="visible" autoplay loop> Error on loading Video</video>';
							
						}*/
    } else {
      bOpacity = "0";
      //bg += getBgHtml(null);
      document.getElementById("bVid").src = "";
    }

    //String variables for areas
    var variables = {
      "top-left": "",
      "top-center": "",
      "top-right": "",
      "bottom-left": "",
      "bottom-center": "",
      "bottom-right": "",
      //'canvas': ""
    };

    /*
				if(data.username && settings["userPos"] && settings["userPos"] != " " && settings["userPos"] != "none"){
					console.log("fetching user info for " + data.username);
					
					
					
					var UserInfo = "";
				
					variables[settings["userPos"]] += UserInfo;
				}*/

    //setBy
    if (settings["textPos"] && settings["textPos"] != "none")
      if (data.set_by) {
        var setBy =
          '<p id="setBy" class="text">👤set_by: ' + data.set_by + "</p>";
        variables[settings["textPos"]] += setBy;
        lastSetBy = data.set_by;
      } else if (settings["textPos"] && settings["textPos"] != "none")
        if (lastSetBy && lastUrl == data.post_url) {
          var setBy =
            '<p id="setBy" class="text">👤set_by: ' + lastSetBy + "</p>";

          variables[settings["textPos"]] += setBy;
        } else lastSetBy = null;

    if (
      settings["showSetterData"] == "true" &&
      settings["setterInfoPos"] &&
      settings["setterInfoPos"] != "none"
    )
      variables[settings["setterInfoPos"]] += '<div id="SetterInfo"></div>';

    //reaction buttons
    if (settings["reactPos"] && settings["reactPos"] != "none")
      if (settings["api_key"].length == 8) {
        var react = "";

        var packs = reactPacks;

        if (settings["reactPacks"].length > 0) packs = settings["reactPacks"];

        if (packs.length > 0) {
          react += '<div id="reactDrop">';
          react +=
            '<button type="button" id="btn_reactDD" ><p id="btn_reactDD_value"> </p><p id="btn_reactDD_arrow">⏷</p></button>';
          react += '<div id="reactDD">';
          react += '<div id="reactDD_scroll">';

          react += '<a href="#" class="reactDD_litxt"> </a>';

          for (var i = 0; i < packs.length; i++) {
            var packTexts = reactions[packs[i]];

            if (packTexts && packTexts.length > 0)
              for (var j = 0; j < packTexts.length; j++) {
                if (packTexts[j] && packTexts[j] != " ")
                  react +=
                    '<a href="#" class="reactDD_litxt">' +
                    packTexts[j] +
                    "</a>";
              }
          }

          react += "</div>";
          react += "</div>";
          react += "</div>";
        }
        react += '<p class="spacer"></p>';

        react += '<div id="buttons">';
        react += '<button type="button" id="btn_hate" >😓';
        react += '<p id="tt_hate" class="tooltipItem">Hate it</p>';
        react += "</button>";
        react += '<button type="button" id="btn_love" >😍';
        react += '<p id="tt_love" class="tooltipItem">Love it</p>';
        react += "</button>";
        react += '<button type="button" id="btn_cum"  >💦';
        react += '<p id="tt_came" class="tooltipItem">I came</p>';
        react += "</button>";
        react += "</div>";

        //tooltipItem
        /*
					if(settings["showTooltips"] == "true"){
					react += '<div id="btn_tooltips" class="tooltipBar">';
					react += '<p id="tt_hate" class="tooltipItem">Hate it</p>';
					react += '<p id="tt_love" class="tooltipItem">Love it</p>';
					react += '<p id="tt_came" class="tooltipItem">I came</p>';					
					react += '</div>';
					}
					*/

        react += "</form>";
        react += '<p class="spacer"></p>';

        variables[settings["reactPos"]] += react;
      }

    //current response to link
    if (settings["responsePos"] && settings["responsePos"] != "none") {
      var response =
        '<p id="reactText" class="text" height="auto" margin="0" text->';

      if (data.response_type) response += reacts[data.response_type];

      if (data.response_text) response += ": " + data.response_text;

      response += " </p>";

      variables[settings["responsePos"]] += response;
    }

    //post Image

    var bg = "";

    //variables["canvas"] += bg;

    //sets the html for each area with the coresponding variables
    areas.forEach((ar, index) => {
      var name = ar;
      if (index > 0) {
        $("#" + name).html(variables[name]);
      }
    });

    //Event functions
    setEvents();

    //sets current dat for next check
    lastUrl = data.post_url;

    lastResponseType = data.response_type;
    lastResponseText = data.response_text;

    //calls ChangeSettings to update css / style
    ChangeSettings();

    //Get infos of setter
    UpdateSetterInfo(data.set_by);
  }
}

function getBgHtml(url) {
  var bg = "";
  bg += '<Img id="bImg" class="bImg" />';
  bg +=
    '<video id="bVid" src="' +
    url +
    '" class="bImg" style="visibility: hidden;" autoplay loop >Video error </video>';

  return bg;
}

function setEvents() {
  var elem;
  //elem = document.getElementById("bImg");

  /*
	$("#bImg").on('load',function (){
		console.log("test");
		elem.style.visibility = "visible";
	});*/

  //elem.onload = function(){elem.style.visibility = "visible";}

  elem = document.getElementById("bVid");
  if (elem) elem.volume = 0;
  //elem.pause();
  if (elem)
    elem.addEventListener("loadeddata", function () {
      var elVid = document.getElementById("bVid");
      elVid.style.visibility = "visible";
      document.getElementById("bImg").style.visibility = "hidden";
      elVid.setAttribute("controls", "");
      elVid.volume = settings["volume"];
      elVid.play();
    });

  elem = document.getElementById("btn_reactDD");
  if (elem)
    elem.addEventListener("click", function () {
      var el_lu = document.getElementById("reactDD");

      if (el_lu.style.visibility == "visible")
        el_lu.style.visibility = "hidden";
      else el_lu.style.visibility = "visible";
    });

  /*
	document.getElementById("reactDD_scroll");
	if(elem)
	elem.addEventListener("mouseenter",function(){
		document.getElementById("reactDD_scroll").focus();	
		console.log("focus dd scroll");
	});*/

  var reactLi = document.getElementsByClassName("reactDD_litxt");
  for (var i = 0; i < reactLi.length; i++) {
    reactLi[i].addEventListener("click", function (event) {
      document.getElementById("btn_reactDD_value").innerHTML = this.innerHTML;
      document.getElementById("reactDD").style.visibility = "hidden";
    });
  }

  if (settings["reactPos"] && settings["reactPos"] != "none")
    if (settings["api_key"].length == 8) {
      elem = document.getElementById("btn_hate");
      elem.addEventListener("click", function () {
        postReaction("disgust");
      });
      if (settings["showTooltips"]) {
        elem.addEventListener("mouseenter", function () {
          document.getElementById("tt_hate").style.visibility = "visible";
        });
        elem.addEventListener("mouseleave", function () {
          document.getElementById("tt_hate").style.visibility = "collapse";
        });
      }

      elem = document.getElementById("btn_love");
      elem.addEventListener("click", function () {
        postReaction("horny");
      });
      if (settings["showTooltips"]) {
        elem.addEventListener("mouseenter", function () {
          document.getElementById("tt_love").style.visibility = "visible";
        });
        elem.addEventListener("mouseleave", function () {
          document.getElementById("tt_love").style.visibility = "collapse";
        });
      }

      elem = document.getElementById("btn_cum");
      elem.addEventListener("click", function () {
        postReaction("came");
      });
      if (settings["showTooltips"]) {
        elem.addEventListener("mouseenter", function () {
          document.getElementById("tt_came").style.visibility = "visible";
        });
        elem.addEventListener("mouseleave", function () {
          document.getElementById("tt_came").style.visibility = "collapse";
        });
      }
    }
}

function toggleAttribute(elem, attName, value) {
  if (elem.hasAttribute(attName)) {
    elem.removeAttribute(attName);
  } else {
    elem.setAttribute(attName, value);
  }
}

LoopSetterUpdate();

function LoopSetterUpdate() {
  if (!settings["overrideURL"]) UpdateSetterInfo(lastSetBy);

  setTimeout(LoopSetterUpdate, settings["interval"]);
}

async function UpdateSetterInfo(username) {
  console.log("Updating Setter Info of " + username);
  if (username && settings["showSetterData"] == "true") {
    var userData = await getUserInfo(username);

    //online and friend status
    if (userData) {
      var setBy = "👤set_by: ";
      if (userData.friend) setBy += "♥️ ";

      if (userData.self) setBy += "you ";
      else setBy += username;
      if (userData.online) {
        setBy += " 🟢";
      }

      $("#setBy").html(setBy);

      //info of links
      if (settings["setterInfoPos"] && settings["setterInfoPos"] != "none")
        if (userData.links) {
          var elInfo = document.createElement("p");
          elInfo.classList.add("text");
          var strInfo = "Links: " + userData.links.length;
          elInfo.innerHTML = strInfo;

          var setElem = document.getElementById("SetterInfo");

          if (setElem) setElem.innerHTML = "";
          if (setElem) setElem.appendChild(elInfo);
          //list of links
          if (setElem && settings["listSetterLinks"] == "true") {
            for (var i = 0; i < userData.links.length; i++) {
              var elLink = document.createElement("p");
              elLink.classList.add("text");
              elLink.style.paddingTop = "0";

              var linkInfo = "";
              if (userData.links[i]) {
                linkInfo += " ➔ [";

                if (userData.links[i].id) linkInfo += userData.links[i].id;

                linkInfo += "] ";
                linkInfo += "last Response:";

                if (userData.links[i].response_type)
                  linkInfo += reacts[userData.links[i].response_type] + " ";

                if (userData.links[i].response_text)
                  linkInfo += userData.links[i].response_text;

                linkInfo += " \n";
              }
              elLink.innerHTML = linkInfo;
              setElem.appendChild(elLink);
            }
          }
        }
    }
  }
}

//gets json from website
//on sucess: calls function setNewPost() (updates background + infos)
function getJSON() {
  if (settings["linkID"]) {
    $.ajaxSetup({
      xhrFields: {
        /*withCredentials:true*/
      },
      crossDomain: true,
      beforeSend: function (request) {
        request.setRequestHeader("Wallpaper-Engine-Client", vNr_str);
        console.log("fetching link " + settings["linkID"]);
        //request.setRequestHeader("Cookie", "user_agent="+name+"/"+vNr_str);
        //request.setRequestHeader("User-Agent" , name + '/' + vNr_str);
      },
    });

    $.getJSON(
      "https://walltaker.joi.how/api/links/" + settings["linkID"] + ".json",
      function (data) {
        setNewPost(data);
      }
    );
  } else console.log("Did not request Link -> linkId was empty");
}

//gets Info from username and returns JSON object of response
async function getUserInfo(username) {
  var json;
  $.ajaxSetup({
    xhrFields: {
      /*withCredentials:true*/
    },
    crossDomain: true,
    beforeSend: function (request) {
      request.setRequestHeader("Wallpaper-Engine-Client", vNr_str);
      console.log("fetching UserInfo of " + username);
      //request.setRequestHeader("Cookie", "user_agent="+name+"/"+vNr_str);
      //request.setRequestHeader("User-Agent" , name + '/' + vNr_str);
    },
  });

  let url = "https://walltaker.joi.how/api/users/" + username + ".json";

  if (settings["api_key"].length == 8) url += "?api_key=" + settings["api_key"];

  let tmp = await fetch(url);
  json = await tmp.json();
  return json;
}

var intervalID = null;

//Loops getJson (= get Data from Website)
var UpdateCanvasRunning = false;
function UpdateCanvas() {
  UpdateCanvasRunning = true;
  if (!settings["overrideURL"]) getJSON();
  else UpdateCanvasRunning = false;

  intervalID = setTimeout(UpdateCanvas, settings["interval"]);
}
