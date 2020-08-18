/** Globals **/

//let attack_roll = `1d20 + @prof + @abilities.str.mod`;
let attack_roll = `1d20 + 10`;
let damage_roll = `2d8 + 5`;
let crit_range = 19;

/** Functions **/

Roll.prototype.chat = function(msg) {
  this.toMessage({
    flavor: msg,
    speaker: ChatMessage.getSpeaker({token: token}),
  });
};

Roll.prototype.roll_with_crit = function(crit) {
  if (crit) {
    let new_roll = [];
    this.formula.split(" ").forEach(function (v) {
      if (v.match(/\d+d\d+/g)) {
        new_roll.push(v);
        new_roll.push("+");
      }
      new_roll.push(v);
    });
    this.formula = new_roll.join(" ");
  }
  return this.roll();
};

Array.prototype.sample = function() {
  return this[Math.floor(Math.random()*this.length)];
};

/** Validation **/

if (!token) {
  ui.notifications.error("No token was selected!");
}

else {

  /** Code **/

  // randomly decide if this is an attack or save roll
  let type = ["attack", "save"].sample();
    
  // randomly decide the damage type
  let damage_type = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"].sample();
  let crit = false;
    
  // calculate raw attack damage and if we've critted
  if (type == "attack") {
    let attack = new Roll(attack_roll, token.actor.getRollData()).roll();
    crit = attack.parts[0].rolls[0]["roll"] >= crit_range;
    if (crit) {
      attack.chat(`${actor.name} fucks you up!`);
    }
    else {
      attack.chat(`${actor.name} attacks!`);
    }
  }

  // randomly determine the save type and DC
  else {
    let ability = ["str", "dex", "int", "wis", "cha"].sample();
    let dc = Math.floor(Math.random() * 8) + 12;
    ChatMessage.create({
      content: `${actor.name}'s eyes glow! [DC ${dc} ${ability} save]`,
      speaker: ChatMessage.getSpeaker({token: token}),
    });
  }

  // roll damage, roll any dice twice if we've critted
  let damage = new Roll(damage_roll, token.actor.getRollData()).roll_with_crit(crit);
  damage.chat(`(${damage_type} damage)`);
}
