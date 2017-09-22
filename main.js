'use strict';

$(document).ready(init);

////// Variables

var token;

////// Initialization

function init() {
  $('div#container').on('click', 'button#register-login', showLogin);
  $('div#container').on('click', 'button#login-register', showRegistration);
  $('div#container').on('click', 'button#profile-cancel', showHomepage);
  $('div#container').on('click', 'button#item-cancel', showHomepage);

  $('div#container').on('click', 'button.home-delete', deleteOffer);
  $('div#container').on('click', 'button.item-accept', acceptOffer);
  $('div#container').on('click', 'button.item-reject', rejectOffer);

  $('div#container').on('click', '#home-profile', showProfile);
  $('div#container').on('click', '#home-logout', showLogin);
  $('div#container').on('click', '#home-list', addItem);
  $('div#container').on('click', '.home-edit', editItem);
  $('div#container').on('click', '.home-view', viewItem);

  $('div#container').on('submit', 'form#login', doLogin);
  $('div#container').on('submit', 'form#register', doRegister);
  $('div#container').on('submit', 'form#profile', saveProfile);
  $('div#container').on('submit', 'form.item-edit', saveItem);
  $('div#container').on('submit', 'form#item-new', newItem);
  $('div#container').on('submit', 'form#item-offer', offerItem);

  initUser();
}

function getPage(url, cb) {
  $.ajax({
    method: 'GET',
    url: url,
    headers: {'X-Authenticate': token},
    success: function(data) {
        $('div#container').children().remove();
        cb(data);
      },
    error: function() {
        $('h4.error').text('We met an unexpected error. Don\'t worry, you\'ll be fine');
        $('div#show-error').modal();
      }
  });
}

function initUser() {
  token = localStorage.token;

  $.ajax({
    method: 'GET',
    url: '/api/user/me',
    headers: {'X-Authenticate': token},
    success: showHomepage,
    error: showLogin
  });
}

function showLogin() {
  localStorage.token = token = undefined;
  getPage('/login', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showHomepage() {
  getPage('/homepage', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showRegistration() {
  getPage('/register', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showProfile() {
  getPage('/profile', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function addItem(event) {
  getPage('/item-edit', function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function editItem(event) {
  getPage('/item-edit/' + event.target.id.substring(3), function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function viewItem(event) {
  getPage('/item-review/' + event.target.id.substring(3), function(html) {
    $('div#container').prepend($.parseHTML(html));
  });
}

function showError() {
  $('h4.error').text('We met an unexpected error. Don\'t worry, you\'ll be fine.');
  $('div#show-error').modal();
}

////// Homepage


////// New User

function doRegister(event) {
  event.preventDefault();

  if ($('input#password').val() !== $('input#_password').val()) {
    $('h4.error').text('Passwords do not match.');
    $('div#show-error').modal();
    return;
  }

  var user = {};
  user.password = $('input#password').val();
  user.username = $('input#username').val();

  $.ajax({
    method: 'POST',
    url: '/api/user/register',
    data: user,
    success: showLogin,
    error: showError
  });
}


////// Login

function doLogin(event) {
  event.preventDefault();

  var user = {};
  user.password = $('input#password').val();
  user.username = $('input#username').val();

  $.ajax({
    method: 'POST',
    url: '/api/user/authenticate',
    data: user,
    success: function(data, textStatus, request) {
      token = request.getResponseHeader('X-Authenticate')
      localStorage.setItem('token', token);
      showHomepage();
    },
    error: showError
  });
}

////// Profile

function saveProfile() {
  event.preventDefault();

  if ($('input#password').val() !== $('input#_password').val()) {
    $('h4.error').text('Passwords do not match.');
    $('div#show-error').modal();
    return;
  }

  var user = {};
  $('form#profile input.ud').each(function() {
    user[$(this).attr('id')] = $(this).val();
  });

  $.ajax({
    method: 'PUT',
    url: '/api/user/me',
    headers: {'X-Authenticate': token},
    data: user,
    success: function() {
      $('h4.error').text('Profile has been saved.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function saveItem(event) {
  event.preventDefault();

  var item = {};
  $('form.item-edit input.ud').each(function() {
    item[$(this).attr('id')] = $(this).val();
  });
  item.forSale = $('input#forSale').prop('checked');
  item._id = event.target.id.substring(3);

  $.ajax({
    method: 'PUT',
    url: '/api/user/item',
    headers: {'X-Authenticate': token},
    data: item,
    success: function() {
      $('h4.error').text('The item has been saved.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function newItem(event) {
  event.preventDefault();

  var item = {};
  $('form#item-new input.ud').each(function() {
    item[$(this).attr('id')] = $(this).val();
  });
  item.forSale = $('input#forSale').prop('checked');

  $.ajax({
    method: 'POST',
    url: '/api/user/item',
    headers: {'X-Authenticate': token},
    data: item,
    success: function() {
      $('h4.error').text('The item has been added.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function offerItem(event) {
  event.preventDefault();

  var offer = {};
  offer.to = $('input#to').val();
  offer.for = $('input#for').val();
  offer.offer = $('select.item').val().substring(3);
  offer.comment = $('input#comment').val();
  console.log('offer', offer);

  $.ajax({
    method: 'POST',
    url: '/api/user/offer',
    headers: {'X-Authenticate': token},
    data: offer,
    success: function() {
      $('h4.error').text('Your offer has been submitted.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function deleteOffer(event) {
  event.preventDefault();
  var offerId = event.target.id.substring(3);

  $.ajax({
    method: 'DELETE',
    url: '/api/user/offer/' + offerId,
    headers: {'X-Authenticate': token},
    success: function() {
      $(event.target).parents('tr.bid').remove();
      $('h4.error').text('Your offer has been deleted.');
      $('div#show-error').modal();
    },
    error: showError
  });
}

function acceptOffer(event) {
  event.preventDefault();
  var offerId = event.target.id.substring(3);

  $.ajax({
    method: 'POST',
    url: '/api/user/offer/accept',
    headers: {'X-Authenticate': token},
    data: {id: offerId},
    success: function() {
      $('h4.error').text('You accepted the offer.');
      $('div#show-error').modal();
      showHomepage();
    },
    error: showError
  });
}

function rejectOffer(event) {
  event.preventDefault();
  var offerId = event.target.id.substring(3);

  $.ajax({
    method: 'POST',
    url: '/api/user/offer/reject',
    headers: {'X-Authenticate': token},
    data: {id: offerId},
    success: function() {
      $(event.target).parents('tr.offer').remove();
      $('h4.error').text('You rejected the offer.');
      $('div#show-error').modal();
    },
    error: showError
  });
}




// var player1final_score = 0;
// var player2final_score = 0;


// var canvas;
// var canvasContext;
// var ballX = 50;
// var ballY = 50;
// var ballSpeedX = 10;
// var ballSpeedY = 4;

// var player1Score = 0;
// var player2Score = 0;
// const WINNING_SCORE = 2;

// var showingWinScreen = false;

// var paddle1Y = 250;
// var paddle2Y = 250;
// const PADDLE_THICKNESS = 10;
// const PADDLE_HEIGHT = 100;

// function calculateMousePos(evt) {
//   var rect = canvas.getBoundingClientRect();
//   var root = document.documentElement;
//   var mouseX = evt.clientX - rect.left - root.scrollLeft;
//   var mouseY = evt.clientY - rect.top - root.scrollTop;
//   return {
//     x:mouseX,
//     y:mouseY
//   };
// }

// function handleMouseClick(evt) {
//   if(showingWinScreen) {
//     player1Score = 0;
//     player2Score = 0;
//     showingWinScreen = false;
//   }
// }

// window.onload = function() {
//   canvas = document.getElementById('gameCanvas');
//   canvasContext = canvas.getContext('2d');

//   var framesPerSecond = 30;
//   setInterval(function() {
//       moveEverything();
//       drawEverything();
//     }, 1000/framesPerSecond);

//   canvas.addEventListener('mousedown', handleMouseClick);

//   canvas.addEventListener('mousemove',
//     function(evt) {
//       var mousePos = calculateMousePos(evt);
//       paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
//     });
// }

// function ballReset() {
//   if(player1Score >= WINNING_SCORE ||
//     player2Score >= WINNING_SCORE) {

//     showingWinScreen = true;

//   }

//   ballSpeedX = -ballSpeedX;
//   ballX = canvas.width/2;
//   ballY = canvas.height/2;
// }

// function computerMovement() {
//   var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
//   if(paddle2YCenter < ballY - 35) {
//     paddle2Y = paddle2Y + 6;
//   } else if(paddle2YCenter > ballY + 35) {
//     paddle2Y = paddle2Y - 6;
//   }
// }

// function moveEverything() {
//   if(showingWinScreen) {
//     return;
//   }

//   computerMovement();

//   ballX = ballX + ballSpeedX;
//   ballY = ballY + ballSpeedY;

//   if(ballX < 0) {
//     if(ballY > paddle1Y &&
//       ballY < paddle1Y+PADDLE_HEIGHT) {
//       ballSpeedX = -ballSpeedX;

//       var deltaY = ballY
//           -(paddle1Y+PADDLE_HEIGHT/2);
//       ballSpeedY = deltaY * 0.35;
//     } else {
//       player2Score++; // must be BEFORE ballReset()
//       ballReset();
//     }
//   }
//   if(ballX > canvas.width) {
//     if(ballY > paddle2Y &&
//       ballY < paddle2Y+PADDLE_HEIGHT) {
//       ballSpeedX = -ballSpeedX;

//       var deltaY = ballY
//           -(paddle2Y+PADDLE_HEIGHT/2);
//       ballSpeedY = deltaY * 0.35;
//     } else {
//       player1Score++; // must be BEFORE ballReset()
//       ballReset();
//     }
//   }
//   if(ballY < 0) {
//     ballSpeedY = -ballSpeedY;
//   }
//   if(ballY > canvas.height) {
//     ballSpeedY = -ballSpeedY;
//   }
// }

// function drawNet() {
//   for(var i=0;i<canvas.height;i+=40) {
//     colorRect(canvas.width/2-1,i,2,20,'white');
//   }
// }


// function drawEverything() {
//   // next line blanks out the screen with black
//   colorRect(0,0,canvas.width,canvas.height,'black');

//   if(showingWinScreen) {
//     canvasContext.fillStyle = 'white';

//     if(player1Score >= WINNING_SCORE) {
//       canvasContext.fillText("Player 1 Won", 350, 200);
//       var count1 = 0;
//       var count1_final = count1 + 1;
//       // player1final_score++;
//       console.log(player1final_score)
//       document.getElementById("player_1").innerHTML = count1_final;

//     } else if(player2Score >= WINNING_SCORE) {
//       canvasContext.fillText("Player 2 Won", 350, 200);
//       var count2 = 0;
//       var count2_final = count2 + 1;
//       console.log(player2final_score)
//       document.getElementById("player_2").innerHTML = count2_final;

//     }

//     canvasContext.fillText("Play Again", 350, 500);
//     return;
//   }

//   drawNet();

//   // this is left player paddle
//   colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

//   // this is right computer paddle
//   colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

//   // next line draws the ball
//   colorCircle(ballX, ballY, 10, 'white');

//   canvasContext.fillText(player1Score, 100, 100);
//   canvasContext.fillText(player2Score, canvas.width-100, 100);
// }

// function colorCircle(centerX, centerY, radius, drawColor) {
//   canvasContext.fillStyle = drawColor;
//   canvasContext.beginPath();
//   canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
//   canvasContext.fill();
// }

// function colorRect(leftX,topY, width,height, drawColor) {
//   canvasContext.fillStyle = drawColor;
//   canvasContext.fillRect(leftX,topY, width,height);
// }
