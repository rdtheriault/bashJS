var login = "admin@kali:";
var homeDir = "/home/admin";
var path = "~$ ";
var loc = "/home/admin";
var error = false;
var t1 = new Terminal();
t1.setHeight("300px");
t1.setWidth('600px');
t1.fixOverflow();

document.body.appendChild(t1.html)

t1.print('This is a fake installation of Kali Linux');
t1.input(login+path, function (input) {
  processing(input);
})

function nextLine() {
  t1.input(login+path, function (input) {
     processing(input);
  })
}

function processing(input) {
  var cmd = removePathing(input);
  var parts = parseCmd(cmd);
  switch (parts[0]){
    case "ls":
      processls(parts);break;
    case "cd":
      processCd(parts);break;
    case "cat":
      processCat(parts);break;
    case "mkdir":
      processMkdir(parts);break;
    case "ping":
      processPing(parts);break;
    default:
      errored();
  }

  nextLine();
  t1.fixTextHeight();//update the scroll so the input is still at the bottom
}

function parseCmd(cmd){
  var parts = cmd.split(" ");
  return parts;
}

function processMkdir(cmd){
  errored("mkdir is not installed");
}
//change to handle host names (regexprs ip addr)
function processPing(cmd){
  if (cmd.length > 1){
    console.log(cmd[1]);
    if (cmd[1] in comps){
      t1.print(' ');
      t1.print('Pinging ' + cmd[1] + ' with 32 bytes of data:');
      t1.print('Reply from ' + cmd[1] + ': bytes=32 time=1ms TTL=126');
      t1.print('Reply from ' + cmd[1] + ': bytes=32 time=1ms TTL=126');
      t1.print('Reply from ' + cmd[1] + ': bytes=32 time=1ms TTL=126');
      t1.print(' ');
      t1.print('Ping statistics for ' + cmd[1] + ':');
      t1.print('      Packets: Sent = 4, Received = 4, Lost = 4 (0% loss),');
      t1.print('Approximate round trip times in milli-seconds: ');
      t1.print('      Minimum = 0ms, Maximum = 1ms, Average = 0ms');
    }
    else if(!validateIP(cmd[1])){
      t1.print('Ping request could not find host ' + cmd[1] + '. Please check the name and try again. ');
    }
    else{
      t1.print(' ');
      t1.print('Pinging ' + cmd[1] + ' with 32 bytes of data:');
      t1.print('Request timed out.');
      t1.print('Request timed out.');
      t1.print('Request timed out.');
      t1.print(' ');
      t1.print('Ping statistics for ' + cmd[1] + ':');
      t1.print('      Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),');
    }
  }
}
/*
Fix so it only goes to places that exist (if includes changed dir)


*/
function processls(cmd){
  var dirArray = []
  if (cmd[0] == "ls"){
    //check command list of correct commands()

    for (var i = 0;i < dirs.length;i++){
      if (dirs[i].startsWith(loc)){
        var current = dirs[i].substring(loc.length);
        var parts;
        parts = current.split("/");//
        if (loc == "/"){//used for root
          if (!dirArray.includes(parts[0]) && parts[0] != undefined){
            dirArray.push(parts[0]);
          }
        }
        else{
          if (!dirArray.includes(parts[1]) && parts[1] != undefined){
            dirArray.push(parts[1]);
          }
        }
      }
    }

    var output = "";
    for (var i = 0;i < dirArray.length;i++){
      output = output + dirArray[i] + " ";
    }
    t1.print(output);
  }
  else{
    errored();
  }
}

function processCat(cmd){
  if (cmd.length > 1){
    var list = cmd;
    var newLoc = "";
    if(list[1].startsWith("/")){
      newLoc = list[1];
    }
    else{//add location and check for files
      newLoc = addLoc(list[1]);
    }
    if ( isFile(newLoc) ){
      t1.print(files[newLoc]);
    }
    else{
      t1.print("cat: can't open "+ newLoc +": No such file or directory");
    }
  }
  else{
    t1.print("Incorrect use of cat command");
  }
}

function processCd(cmd){
  if (cmd.length > 1){
    var newDir = cmd[1];
    if ( isFile(addLoc(newDir)) || isFile(newDir) ){
      t1.print("cd: can't cd to " + newDir + ": Not a directory")
    }
    else if(dirs.includes(newDir)){
      loc = newDir;
    }
    else if(newDir == ".."){
      if (loc != "/"){
        loc = goBackOne();
      }
    }
    else{
      var checkFailed = true;
      for (var i = 0;i < dirs.length;i++){
        if (dirs[i].startsWith(loc)){//check if the dirs element starts with the current location
          var current = dirs[i].substring(loc.length);
          var parts = current.split("/");
          if (current == newDir){
            loc = loc + newDir;
            checkFailed = false;
            break;
          }
          else if (parts[0] == newDir){
            loc = loc + newDir;
            checkFailed = false;
            break;
          }
          else if(current.substring(1) == newDir){
            loc = loc + "/" + newDir;
            checkFailed = false;
            break;
          }
        }
      }
      if (checkFailed){
        errored("No such file or directory");
      }
    }
  }
  else if (cmd === "cd"){
    loc = homeDir;
  }
  else{
    errored();
  }
  updatePath();
}

function updatePath(){
  if (loc == homeDir){
    path = "~$ ";
  }
  else {
    path = loc + "$ ";
  }
}

function removePathing(input){//take all put current away from path
  var lengthTotal = login.length + path.length;
  return input.substring(lengthTotal);
}

function addLoc(extra){//add current to loc to get full path
  var newLoc = loc + "/" + extra;
  return newLoc;
}

function isFile(path){//make sure to send full path
  if (path in files){
    return true;
  }
  else {
    return false;
  }

}

function errored(msg) {
  if (msg){
    t1.print(msg);
  }
  else{
    t1.print("Command not found")
  }
}

function goBackOne(path){//takes path and goes back one directory    /home/admin -> /home
  var parts = loc.split("/");
  var next = parts[parts.length-1];
  var endLen = next.length;
  var final = loc.substring(0,loc.length-endLen-1);
  if (final == ""){
    return "/";
  }else{
    return final;
  }
}

function validateIP(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return (true)
  }
  //alert("You have entered an invalid IP address!")
  return (false)
}
