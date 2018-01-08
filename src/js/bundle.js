var current = [];
var tasks = [];
var nextID = 0;

function Dashboard(){
  this.globalState = false;
  this.messages = ['Create new card', 'Delete card', 'Changes saved', 'All fields are required'];
  this.area = {
    main: document.querySelector('.main-content'),
    container: document.querySelector('.content-area'),
    submit: document.querySelector('.btn-submit'),
    message: document.querySelector('.message')
  }
  this.sidebar = {
    title: document.querySelector('.input--title'),
    content: document.querySelector('.input--content'),
    author: document.querySelector('.input--author')
  }
  this.buttons = {
    submit: document.querySelector('.btn-submit')
  }
};

Dashboard.prototype.validate = function(){
  if(!this.globalState){
    var data = {};
    for(var key in this.sidebar){
      if(this.sidebar.hasOwnProperty(key) && this.sidebar[key].value){
        data[key] = this.sidebar[key].value;
      }

      else{
        this.log('All fields are required');
        return false;
      }
    }
    new Task(JSON.stringify(data));
    this.removeFields();
  }
}

Dashboard.prototype.removeFields = function(){
  for(var key in this.sidebar){
    if(this.sidebar.hasOwnProperty(key)){
      this.sidebar[key].value = '';
    }
  }
}

Dashboard.prototype.log = function(message){
  for(let i=0; i < this.messages.length; i++){
    if(this.messages.indexOf(message) === i){
      this.area.message.classList.add('animate-msg');
      this.area.message.textContent = this.messages[i];
    }
  }
  setTimeout(function(){
    this.area.message.classList.remove('animate-msg');
  }.bind(this), 3000);
}

Dashboard.prototype.init = function(){
  this.validate();
}

function Task(data){
  Dashboard.call(this);
  this.id = nextID++;
  this.posX = 0;
  this.posY = 0;
  this.resizeX = 0;
  this.resizeY = 0;
  this.encodeData = JSON.parse(data);
  this.onDrag = this.draggable.bind(this);
  this.onResize = this.resize.bind(this);
  this.activeText = null;
  this.currentText = null;
  this.editArea = false;
  this.activeArea = true;
  this.single = {
    article: document.createElement('article'),
    header: document.createElement('header'),
    h: document.createElement('h2'),
    hText: document.createTextNode(''),
    paragraph: document.createElement('p'),
    paragraphText: document.createTextNode(''),
    author: document.createElement('p'),
    authorText: document.createTextNode(''),
    edit: document.createElement('span'),
    resize: document.createElement('div')
  }
  this.initTask();
  tasks.push(this);
  current.push(this.id);
}

Task.prototype = Object.create(Dashboard.prototype);
Task.prototype.constructor = Task;

Task.prototype.create = function(){
  this.single.article.classList.add('task');
  this.single.article.classList.add('task' + this.id);

  this.single.article.appendChild(this.single.edit);
  this.single.article.appendChild(this.single.header);
  this.single.article.appendChild(this.single.paragraph);
  this.single.article.appendChild(this.single.author);
  this.single.article.appendChild(this.single.resize);
  this.single.header.appendChild(this.single.h);

  this.single.resize.classList.add('resize');
  this.single.edit.classList.add('icon-edit');
  this.single.header.classList.add('task-header');
  this.single.h.classList.add('task-header__title')
  this.single.paragraph.classList.add('task__text')
  this.single.author.classList.add('task__author')

  this.single.h.appendChild(this.single.hText);
  this.single.h.appendChild(document.createElement('span'));

  this.single.paragraph.appendChild(this.single.paragraphText);
  this.single.paragraph.appendChild(document.createElement('span'));

  this.single.author.appendChild(this.single.authorText);
  this.single.author.appendChild(document.createElement('span'));

  this.single.hText.textContent = this.encodeData.title;
  this.single.paragraphText.textContent = this.encodeData.content
  this.single.authorText.textContent = this.encodeData.author

  this.area.container.appendChild(this.single.article);

  this.removeFields();
  this.log('Create new card');
}

Task.prototype.pressedMouse = function(e){
  if(e.target !== this.single.edit){
    this.posX = e.clientX - this.single.article.offsetLeft;
    this.posY = e.clientY - this.single.article.offsetTop

    this.edit(e);
    document.addEventListener('mousemove', this.onDrag);
  }

  if(e.target === this.single.resize){
    this.resizeX = e.clientX - this.single.article.clientWidth;
    this.resizeY = e.clientY - this.single.article.clientHeight;

    document.removeEventListener('mousemove', this.onDrag);
    document.addEventListener('mousemove', this.onResize)
  }

  if(e.target === this.single.edit){
    this.editArea = !this.editArea;
    this.current(e);
    this.edit(e);
  }
}

Task.prototype.mouseUp = function(){
  document.removeEventListener('mousemove', this.onDrag);
  document.removeEventListener('mousemove', this.onResize);
}

Task.prototype.draggable = function(e){
  var currentPosX =  e.clientX - this.posX;
  var currentPosY =  e.clientY - this.posY;

  var maxWidthArea = this.area.container.clientWidth - this.single.article.clientWidth;
  var maxHeightArea = this.area.container.clientHeight - this.single.article.clientHeight;

  if(currentPosX >= maxWidthArea){
    currentPosX = maxWidthArea;
  }

    if(currentPosY >= maxHeightArea){
      currentPosY = maxHeightArea;
    }

      if(currentPosX < 0 ){
          currentPosX = 0;
      }

      if(currentPosY < 0){
        currentPosY = 0;
      }

  this.single.article.style.left =  currentPosX + 'px';
  this.single.article.style.top = currentPosY + 'px';
}

Task.prototype.resize = function(e){

  var maxWidthResize = this.area.container.clientWidth - this.single.article.offsetLeft;
  var maxHeightResize = this.area.container.clientHeight - this.single.article.offsetTop;

  var resizeX = e.clientX - this.resizeX;
  var resizeY = e.clientY - this.resizeY;

  var widthResize = 150;


  if(resizeX >= maxWidthResize){
    resizeX = maxWidthResize;
  }

    if(resizeX <= widthResize){
      resizeX = widthResize;
    }

      if (resizeY >= maxHeightResize) {
        resizeY = maxHeightResize;
      }

  this.single.article.style.width = resizeX + 'px';
  this.single.article.style.minHeight = resizeY + 'px';
}

Task.prototype.edit = function(e){
  if(this.editArea){
    for(var key in this.single){

      if(this.single[key] === this.single.h && this.activeArea){
        this.activeText = this.single[key].childNodes[0].nodeValue;
        this.currentText = this.single[key].childNodes;

        this.currentText[1].classList.add('index');
      }

      else if(this.single[key] === e.target && this.single[key] !== this.single.edit && this.single[key] !== this.single.resize && this.single[key] !== this.single.article && this.single[key] !== this.single.header){

        this.currentText[1].classList.remove('index');

        this.activeText = this.single[key].childNodes[0].nodeValue;
        this.currentText = this.single[key].childNodes;

        this.currentText[1].classList.add('index')
        this.activeArea = false;



      }
    }

    if(e.keyCode === 8){
      this.activeText = this.activeText.slice(0, this.activeText.length - 1);
      this.currentText[0].textContent = this.activeText;
    }

    else if(e.keyCode === 13){
      this.currentText[1].classList.remove('index');
      this.log('Changes saved');
      this.editArea = false;
      this.activeArea = true;
    }

    else if(e.keyCode === 27){

    }

    else if (e.keyCode){
      var newChar = this.activeText += e.key;
      this.currentText[0].textContent = newChar;
    }
  }

  else{
    for(var key in this.single){
      if(this.single[key].childNodes[1]){
        this.single[key].childNodes[1].classList.remove('index');
      }
    }
    this.activeArea = true;
  }
}

Task.prototype.current = function(e){
var self = this;
  current.forEach(function(value,index){
    if(e.target === self.single.edit){
      if(value === self.id){
        ///return false;
      }

      else{
        tasks[index].editArea = false;
        tasks[index].edit();
      }
    }
  });
}

Task.prototype.initTask = function(){
  this.create();
  this.single.article.addEventListener('mousedown', this.pressedMouse.bind(this));
  document.addEventListener('mouseup', this.mouseUp.bind(this));
  document.addEventListener('keydown', this.edit.bind(this));
}

window.addEventListener('load', function(){
  var dashboard = new Dashboard();
  dashboard.buttons.submit.addEventListener('click', function(e){
    e.preventDefault();
    dashboard.init();
  })
})
