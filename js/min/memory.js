"use strict";function buildCards(){var a=[];return cardFaces.forEach(function(e,d){a.push({face:e,id:d})}),a=_.concat(a,a),a=cheating?_.sortBy(a,"face"):_.shuffle(a)}function checkWinState(){matches===toWin&&(alert("Congratulations!"),reset())}function checkClickedCard(a){var e=$field.find(".card"),d=e.filter(".pick"),s=$(a.target).parent(".card");if($field.hasClass("paused"))return void updateHud("Wait a moment");if(!s.hasClass("shown"))if(0===d.length)s.removeClass("hidden").addClass("shown pick"),updateHud("Now find its match");else{var t=d.data("id"),c=s.data("id");s.removeClass("hidden").addClass("shown guess"),t!==c?($field.addClass("paused"),updateHud("Whoops!"),setTimeout(function(){s.add(d).removeClass("shown guess pick").addClass("hidden"),$field.removeClass("paused"),updateHud("Pick another card")},1100)):(matches++,updateHud("Nice job! Pick another card"),checkWinState(),e.removeClass("guess pick"))}}function placeCards(a){a.forEach(function(a){var e=$('<div class="card hidden" data-id="'+a.id+'">\n                        <div class="back"></div>\n                        <div class="face">'+a.face+"</div>\n                     </div>");e.click(checkClickedCard),$field.append(e)})}function reset(){matches=0;var a=buildCards();$field.empty(),placeCards(a),updateHud("Pick a card")}function updateHud(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";$hud.html("Matches: <b>"+matches+"/"+toWin+"</b> <span>"+a+"</span>")}var $field=$("#playfield"),$hud=$("#hud"),cardFaces=["🍟","😃","😈","🤠","🤖","👽","😴","🤔","😡","🤑","😇","💩"],matches=0,toWin=12,cheating=!1;window.cheat=function(){cheating=!0,reset(),updateHud("Cheat mode: Matches placed together")},reset();