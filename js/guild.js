// jshint esversion: 6
const forms = {
    'invalid': {
        position: 'top-end',
        type: "error",
        title: "Ошибка!",
        html: "Вы не ввели никнейм игрока, или введённый никнейм некорректен.",
        showConfirmButton: true,
        timer: 15000
    },
    'not-200': {
        position: 'center',
        type: "error",
        title: "Ошибка!",
        html: "Возникли какие-то технические шоколадки с VimeWorld API. Простите. >:/",
        showConfirmButton: true,
        timer: 15000
    },
    'other': (text) => {
        return {
            position: 'center',
            type: "error",
            title: "Ошибка!",
            html: text,
            showConfirmButton: true,
            timer: 15000
        };
    }
};

function rank(rank) {
    const ranks = {};
    switch (rank) {
        case "ADMIN":
            ranks.name = "Гл. Админ";
            ranks.color = "#00bebe";
            break;
        case "DEV":
            ranks.name = "Разработчик";
            ranks.color = "#00bebe";
            break;
        case "ORGANIZER":
            ranks.name = "Организатор";
            ranks.color = "#00bebe";
            break;
        case "CHIEF":
            ranks.name = "Гл. Модер";
            ranks.color = "#4777e6";
            break;
        case "WARDEN":
            ranks.name = "Пр. Модер";
            ranks.color = "#4777e6";
            break;
        case "MODER":
            ranks.name = "Модер";
            ranks.color = "#4777e6";
            break;
        case "MAPLEAD":
            ranks.name = "Гл. Билдер";
            ranks.color = "#009c00";
            break;
        case "BUILDER":
            ranks.name = "Билдер";
            ranks.color = "#009c00";
            break;
        case "YOUTUBE":
            ranks.name = "YouTube";
            ranks.color = "#fe3f3f";
            break;
        case "IMMORTAL":
            ranks.name = "Immortal";
            ranks.color = "#e800d5";
            break;
        case "HOLY":
            ranks.name = "Holy";
            ranks.color = "#ffba2d";
            break;
        case "PREMIUM":
            ranks.name = "Premium";
            ranks.color = "#00dada";
            break;
        case "VIP":
            ranks.name = "VIP";
            ranks.color = "#00be00";
            break;
    
        default:
            ranks.name = "Игрок";
            ranks.color = null;
            break;
    }

    return ranks;
}

const guildTag = {
	"&0": "000000",
	"&1": "0000AA",
	"&2": "00AA00",
	"&3": "00AAAA",
	"&4": "AA0000",
	"&5": "AA00AA",
	"&6": "FFAA00",
	"&7": "AAAAAA",
	"&8": "555555",
	"&9": "5555FF",
	"&a": "55FF55",
	"&b": "55FFFF",
	"&c": "FF5555",
	"&d": "FF55FF",
	"&e": "FFFF55",
	"&f": null
};

const uri = "https://api.vimeworld.ru";
const uriSite = "https://vimeinfo.github.io";
const uriSkin = "https://skin.vimeworld.ru";

const userURL = (name) => encodeURI(`${uriSite}/index.html#${name}`);
const guildURL = (name) => encodeURI(`${uriSite}/guild.html#${name}`);
const searchGuild = (name) => encodeURI(`${uri}/guild/get?name=${name}`);
const userAvatar = (name) => encodeURI(`${uriSkin}/helm/${name}.png`);

// https://github.com/vimestats/api/blob/master/app/src/utils/constants.ts#L4 :)
const usernameRegex = /[a-zA-Z0-9_]{1,16}$/;

if(document.URL.includes("#")) {
    let guildname = document.URL.replace(uriSite, '').replace('/guild.html#', '');
    if(!guildname || !usernameRegex.test(guildname)) return Swal.fire(forms.invalid);
    
    $.ajax({
        url: searchGuild(guildname),
        type: "GET",
        json: true,
        cache: false,
        success: (guildData) => {
            if(guildData.error) return Swal.fire(forms.other(guildData.error.message));
            const formInfo = document.getElementById("guildInfo");

            let guild = `<a href="${guildURL(guildData.name)}" target="_blank"><span style="color: #${guildTag[guildData.color]};"><b>${(guildData.tag !== null) ? `[${guildData.tag}] ` : ''}${guildData.name}</b></span></a>`;
            let levelPercentage = Math.ceil(guildData.levelPercentage * 100);
            let guildAvatar = `<img alt="Аватарка гильдии ${guildData.name}" width="140" height="140" src="${encodeURI(guildData.avatar_url)}">`;
            let heads = ['', '', ''];
            
            let vall = {
                coins: 0,
                xp: 0
            };

            guildData.members.forEach((userData) => {
                vall.coins += userData.guildCoins;
                vall.xp += userData.guildExp;
                if(userData.status == "LEADER") return heads[0] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
                else if(userData.status == "OFFICER") return heads[1] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
                else if(userData.status == "MEMBER") return heads[2] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
            });

            return formInfo.innerHTML = `${guild}`
                +`<hr>ID гильдии: <b>${guildData.id}</b>`
                +`<br>Уровень: <b>${guildData.level} ур. [${levelPercentage}%]</b>`
                +`<br>Всего вложено коинов: <b>${vall.coins}</b>`
                +`<br>Всего наиграно опыта: <b>${vall.xp}</b>`
                +`<br>Дата создания: <b>${new Date((guildData.created * 1000)).toString()}</b>`
                +`<hr>${guildAvatar}`
                +`<hr>${heads[0]}`
                +`<hr>${heads[1]}`
                +`<hr>${heads[2]}`;
        }
    });
}

document.body.addEventListener("submit", (e) => {
    e.preventDefault();

    let guildname = document.getElementById("guildname").value;
    if(!guildname || !usernameRegex.test(guildname)) return Swal.fire(forms.invalid);

    $.ajax({
        url: searchGuild(guildname),
        type: "GET",
        json: true,
        cache: false,
        success: (guildData) => {
            if(guildData.error) return Swal.fire(forms.other(guildData.error.message));
            const formInfo = document.getElementById("guildInfo");

            let guild = `<a href="${guildURL(guildData.name)}" target="_blank"><span style="color: #${guildTag[guildData.color]};"><b>${(guildData.tag !== null) ? `[${guildData.tag}] ` : ''}${guildData.name}</b></span></a>`;
            let levelPercentage = Math.ceil(guildData.levelPercentage * 100);
            let guildAvatar = `<img alt="Аватарка гильдии ${guildData.name}" width="140" height="140" src="${encodeURI(guildData.avatar_url)}">`;
            let heads = ['', '', ''];
            
            let vall = {
                coins: 0,
                xp: 0
            };

            guildData.members.forEach((userData) => {
                vall.coins += userData.guildCoins;
                vall.xp += userData.guildExp;
                if(userData.status == "LEADER") return heads[0] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
                else if(userData.status == "OFFICER") return heads[1] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
                else if(userData.status == "MEMBER") return heads[2] += `<a href="${userURL(userData.user.username)}" target="_blank"><img width="64" height="64" alt="Голова игрока ${userData.user.username}" src="${userAvatar(userData.user.username)}"></a> `;
            });

            return formInfo.innerHTML = `${guild}`
                +`<hr>ID гильдии: <b>${guildData.id}</b>`
                +`<br>Уровень: <b>${guildData.level} ур. [${levelPercentage}%]</b>`
                +`<br>Всего вложено коинов: <b>${vall.coins}</b>`
                +`<br>Всего наиграно опыта: <b>${vall.xp}</b>`
                +`<br>Дата создания: <b>${new Date((guildData.created * 1000)).toString()}</b>`
                +`<hr>${guildAvatar}`
                +`<hr>${heads[0]}`
                +`<hr>${heads[1]}`
                +`<hr>${heads[2]}`;
        }
    });
});