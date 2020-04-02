// jshint esversion: 6
const forms = {
    invalid: {
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
    other: (text) => {
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
const searchUser = (username) => encodeURI(`${uri}/user/name/${username}`);
const getSkin = (username) => encodeURI(`${uriSkin}/helm/${username}.png`);

// https://github.com/vimestats/api/blob/master/app/src/utils/constants.ts#L4 :)
const usernameRegex = /[a-zA-Z0-9_]{1,16}$/;

if(document.URL.includes("#")) {
    let username = document.URL.replace(uriSite, '').replace('/#', '').replace('/index.html#', '');
    if(!username || !usernameRegex.test(username)) Swal.fire(forms.invalid);
    else
    $.ajax({
        url: searchUser(username),
        type: "GET",
        json: true,
        cache: false,
        success: (userData) => {
            if(userData.error) return Swal.fire(forms.other(userData.error.message));
            const formInfo = document.getElementById("userInfo");

            let r = rank(userData[0].rank);
            let playedHours = Math.floor(userData[0].playedSeconds / 3600);
            let playedMinutes = Math.floor(userData[0].playedSeconds / 60);
            let played = (playedHours > 0) ? `${playedHours} ч.` : `${playedMinutes} мин.`;
            let levelPercentage = Math.ceil(userData[0].levelPercentage * 100);

            let guild = (userData[0].guild !== null)
                ? `Состоит в гильдии: <a href="${guildURL(userData[0].guild.name)}" target="_blank"><span style="color: #${guildTag[userData[0].guild.color]};"><b>${(userData[0].guild.tag !== null) ? `[${userData[0].guild.tag}] ` : ''}${userData[0].guild.name}</b></span></a>`
                : 'Не состоит в гильдии';

            let guildAvatar = `<img alt="Аватарка гильдии ${userData[0].guild.name}" width="140" height="140" src="${encodeURI(userData[0].guild.avatar_url)}">`;
            let userAvatar = `<img alt="Голова игрока ${userData[0].username}" width="140" height="140" src="${getSkin(userData[0].username)}">`;

            return formInfo.innerHTML = `<a href="${userURL(userData[0].username)}" target="_blank"><span style="color: ${r.color};"><b>[${r.name}] ${userData[0].username}</b></span></a>`
                +`<hr>ID аккаунта: <b>${userData[0].id}</b>`
                +`<br>Уровень: <b>${userData[0].level} ур. [${levelPercentage}%]</b>`
                +`<br>Наиграно времени: <b>${played}</b>`
                +`<br>Последний вход: <b>${new Date((userData[0].lastSeen * 1000)).toString()}</b>`
                +`<br>${guild}`
                +`<hr>${userAvatar} ${guildAvatar}`;
        }
    });
}

document.body.addEventListener("submit", (e) => {
    e.preventDefault();

    let username = document.getElementById("username").value;
    if(!username || !usernameRegex.test(username)) return Swal.fire(forms.invalid);

    $.ajax({
        url: searchUser(username),
        type: "GET",
        json: true,
        cache: false,
        success: (userData) => {
            if(userData.error) return Swal.fire(forms.other(userData.error.message));
            const formInfo = document.getElementById("userInfo");

            let r = rank(userData[0].rank);
            let playedHours = Math.floor(userData[0].playedSeconds / 3600);
            let playedMinutes = Math.floor(userData[0].playedSeconds / 60);
            let played = (playedHours > 0) ? `${playedHours} ч.` : `${playedMinutes} мин.`;
            let levelPercentage = Math.ceil(userData[0].levelPercentage * 100);

            let guild = (userData[0].guild !== null)
                ? `Состоит в гильдии: <a href="${guildURL(userData[0].guild.name)}" target="_blank"><span style="color: #${guildTag[userData[0].guild.color]};"><b>${(userData[0].guild.tag !== null) ? `[${userData[0].guild.tag}] ` : ''}${userData[0].guild.name}</b></span></a>`
                : 'Не состоит в гильдии';

            let guildAvatar = (userData[0].guild !== null)
	    	? `<img alt="Аватарка гильдии ${userData[0].guild.name}" width="140" height="140" src="${encodeURI(userData[0].guild.avatar_url)}">`
	    	: '';
		
            let userAvatar = `<img alt="Голова игрока ${userData[0].username}" width="140" height="140" src="${getSkin(userData[0].username)}">`;

            return formInfo.innerHTML = `<a href="${userURL(userData[0].username)}" target="_blank"><span style="color: ${r.color};"><b>[${r.name}] ${userData[0].username}</b></span></a>`
                +`<hr>ID аккаунта: <b>${userData[0].id}</b>`
                +`<br>Уровень: <b>${userData[0].level} ур. [${levelPercentage}%]</b>`
                +`<br>Наиграно времени: <b>${played}</b>`
                +`<br>Последний вход: <b>${new Date((userData[0].lastSeen * 1000)).toString()}</b>`
                +`<br>${guild}`
                +`<hr>${userAvatar} ${guildAvatar}`;
        }
    });
});
