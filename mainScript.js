if (localStorage.system == undefined)
{
    alert("This is a work in progress!")
}

let systemReload = false;

let text = document.getElementById("textArea");
let prompt = document.getElementById("text");
let initPromptText = "null@null:~$"
let promptText = "null@null:~$"
prompt.innerText = promptText;
let initSystem = {
    "/": {
        "README.md": {},
        "test": {
            "lol": {
                "lmao": {}
            }
        }
    }
};
let system = initSystem
if (localStorage.system == undefined)
{
    localStorage.system = JSON.stringify(system)
}
else
{
    system = JSON.parse(localStorage.system)
}

let commands = {
    "ls": {},
    "echo [text]": {},
    "mkdir [name]": {},
    "cd [directory]": {},
    "cls": {},
    "hardReset": {}
    //"newusr [name password]": {}
}


let currentDirStr = "/";
let currentDir = system["/"];
let lastDir = system["/"];
let lastDirStr = "/";

function loadDirectoryFromString(str)
{
    let element = str.split("/")[0]
    if (str == '')
    {
        currentDir = system["/"]
        currentDirStr.split("/").forEach(folder => {
            if (folder != '')
            {
                currentDir = currentDir[folder]
            }
        })
        if (currentDir == undefined)
        {
            prompt.innerText += "\nERROR:";
            text.innerText += `\nThe directory '${currentDirStr}' does not exist`
            currentDir = lastDir
            currentDirStr = lastDirStr
        }
        else
        {
            promptText = initPromptText.split("$")[0] + `${currentDirStr}$`
        }
        return;
    }
    else if (element == "..")
    {
        currentDirStr = currentDirStr.split("/").slice(0, -1).join("/")
    }
    else if (element.includes("."))
    {
        //its a openable file
        file = element.split(".")[0]
        readTextFile(`${file}.txt`)

    }
    else
    {
        currentDirStr += `/${element}`
    }
    str = str.split("/").slice(1).join("/")
    loadDirectoryFromString(str)
}

window.addEventListener("keydown", function(event){
    if (event.key == "Enter"){
        let unfiltered = text.innerText.split("\n").slice(-1)[0].split(" ");
        let command = unfiltered[0];
        let information = unfiltered.splice(1);
        commandSorter(command, information);
        if (prompt.innerText != "")
        {
            prompt.innerText += `\n${promptText}`;
            text.innerText += "\n";
        }
        else
        {
            prompt.innerText = promptText;
            text.innerText = "";
        }
    } else if (event.key == "Shift" || event.key == "Control" || event.key == "Undefined" ){

    } else if (event.key == "Backspace") {
        if (text.innerText.split("\n").slice(-1)[0].split(" ") != "")
        {
            text.innerText = text.innerText.slice(0, -1)
        }
    } else {
        text.innerText += event.key;
    }
})

function commandSorter(callback, information)
{
    try
    {
        window[callback](information);
    }
    catch(err)
    {
        prompt.innerText += "\nERROR:";
        text.innerText += `\n"${callback}" could not be found or syntax was not used properly`;
        //console.log(err)
    }
}

//COMMANDS

function cd(info){
    info = info.join(" ");
    lastDir = currentDir;
    lastDirStr = currentDirStr;
    loadDirectoryFromString(info)
}

function echo(info)
{
    info = info.join(" ");
    prompt.innerText += "\n";
    text.innerText += `\n${info}`;
}

function help(command)
{
    if (command != "")
    {
        //console.log("not empty") #wip

    } else {
        //console.log("empty")
        prompt.innerText += "\nCommands:"
        text.innerText += "\n"
        Object.keys(commands).forEach(element => {
            prompt.innerText += "\n"
            text.innerText += `\n${element}`
        });
        
    }
}

function test(lol){console.log(lol)}

ls = dir = function()
{
    prompt.innerText += "\nDirectory:"
    text.innerText += "\n"
    Object.keys(currentDir).forEach(element => {
        prompt.innerText += "\n"
        text.innerText += `\n${element}`   
    });
}

function mkdir(name)
{
    if (currentDir[name] == undefined)
    {
        currentDir[name] = {};
    }
    else
    {
        prompt.innerText += "\nERROR:";
        text.innerText += `\nThe directory '${name}' already exists!`;
    }
}

function cls()
{
    text.innerText = "";
    prompt.innerText = "";
}

function hardReset()
{
    localStorage.clear();
    system = initSystem;
    systemReload = true;
    location.reload()
}





//OTHER STUFF
window.addEventListener("beforeunload", function (e) {
    if (!systemReload)
    {
        localStorage.system = JSON.stringify(system);
        var confirmationMessage = "Dont Leave T-T";
    
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
  
});