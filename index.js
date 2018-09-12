var request = require('request');
var numeral = require('numeral');
var rsapi = require('runescape-api');

var BASE_SKILLS = [
    'overall', 'attack', 'defence', 'strength', 'hitpoints', 'ranged',
    'prayer', 'magic', 'cooking', 'woodcutting', 'fletching', 'fishing',
    'firemaking', 'crafting', 'smithing', 'mining', 'herblore', 'agility',
    'thieving', 'slayer', 'farming', 'runecraft', 'hunter', 'construction'
];

var lookup = () => {

    return {

        getRunescapeCommands: () => {
            return ['skills'];
        },

        processRunescapeMessage: (author, commandLine, command, split, discordQueue, runescapeQueue) => {
            if (split.length < 2) {
                runescapeQueue.push(['Correct usage: .skills (name) (optional: skill_id)', undefined, new Date()]);
                return;
            }
            var name = split[1].toLowerCase();
            var skill_id = -1;
            if (split.length == 3)
                skill_id = split[2];
            if (isNaN(skill_id)) {
                runescapeQueue.push(['Correct usage: .skills (name) (optional: skill_id)', undefined, new Date()]);
                return;
            }
            skill_id = parseInt(skill_id);
            rsapi.rs.hiscores.player(name).then((stats) => {
                var skill_name = BASE_SKILLS[skill_id + 1];
                var stats = stats.skills[skill_name.toLowerCase()];
                skill_name = skill_name.charAt(0).toUpperCase() + skill_name.substring(1, skill_name.length);
                runescapeQueue.push([`${skill_name} level for ${name}: ${numeral(stats.level).format(0,0)}. XP: ${numeral(stats.exp).format(0,0)}. Rank: ${numeral(stats.rank).format(0,0)}`])
            }).catch((err) => {
                runescapeQueue.push([`Error looking up ${name}: ${err}`, undefined, new Date()]);
            })
        }

    };

};
module.exports = lookup;