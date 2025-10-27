//Stories
const modal = document.getElementById("customModal");
const storyButtons = document.querySelectorAll(".stories a");
const closeModalBtn = document.querySelectorAll(".close-btn");
const debugWrapper = document.querySelector(".debug");
const swiperModal = document.querySelector(".swiper-modal");


let mainSwiper = null;
let innerSwipers = {};
let defaultDuration = 3000;

mainSwiper = new Swiper(".main-swiper", {
  effect: "cube",
  grabCursor: false,
  speed: 800,
  loop: false,
  allowTouchMove: true,
  cubeEffect: { shadow: false },
  navigation: {
    nextEl: ".swipe-main-next",
    prevEl: ".swipe-main-prev",
  },
  on: {
    slideChange: function (swiper) {
      cleanupInnerSwipers(swiper.activeIndex);
      handleInnerSwiper(swiper.activeIndex);
    },
  },
});


function cleanupInnerSwipers(activeIndex) {
  Object.keys(innerSwipers).forEach((key) => {
    const swiperIndex = parseInt(key);
    if (swiperIndex !== activeIndex) {
      innerSwipers[swiperIndex].destroy(true, true);
      delete innerSwipers[swiperIndex];
    }
  });
}

// Open modal & initialize stories
storyButtons.forEach((button, index) => {
  button.addEventListener("click", () => openModal(index));
});

function openModal(index) {
  modal.classList.add("show-modal");
  mainSwiper.slideTo(index, 0, false);
  handleInnerSwiper(index);
}


closeModalBtn.forEach((button) => {
  button.addEventListener("click", closeModal);
});

function closeModal() {
  modal.classList.remove("show-modal");
  Object.values(innerSwipers).forEach((swiper) => swiper.destroy(true, true));
  innerSwipers = {};
  debugWrapper.innerHTML = "Modal closed";
}


function pauseAllVideos(container) {
  container.querySelectorAll("video").forEach((v) => v.pause());
}
function playActiveVideo(container, index) {
  const video = container.querySelectorAll(".swiper-slide")[index]?.querySelector("video");
  if (video) video.play();
}


function updateProgressBar(swiper, time, progress) {
  swiper.pagination.bullets.forEach((bullet, index) => {
    const bar = bullet.querySelector(".progress-bar");
    if (!bar) return;

    if (index < swiper.activeIndex) {
      bar.style.width = "100%";
    } else if (index === swiper.activeIndex) {
      bar.style.width = `${(1 - progress) * 100}%`;
    } else {
      bar.style.width = 0;
    }
  });
}

function handleInnerSwiper(index) {
  if (innerSwipers[index]) return;

  const innerContainer = document.querySelectorAll(".inner-swiper")[index];
  if (!innerContainer) return;

  const nextBtn = innerContainer.querySelector(".swiper-inner-next");
  const prevBtn = innerContainer.querySelector(".swiper-inner-prev");

  const innerSwiper = new Swiper(innerContainer, {
    direction: "horizontal",
    loop: false,
    effect: "fade",
    allowTouchMove: false,
    autoplay: {
      delay: defaultDuration,
      disableOnInteraction: false,
    },
    pagination: {
      el: innerContainer.querySelector(".swiper-pagination"),
      clickable: true,
      renderBullet: function (i, className) {
        return `<span class="${className}"><span class="progress-bar"></span></span>`;
      },
    },
    navigation: { nextEl: nextBtn, prevEl: prevBtn },
    on: {
      init: function (swiper) {
        playActiveVideo(swiper.el, swiper.activeIndex);
      },
      autoplayTimeLeft: updateProgressBar,
      slideChangeTransitionStart: function (swiper) {
        pauseAllVideos(swiper.el);
      },
      slideChangeTransitionEnd: function (swiper) {
        playActiveVideo(swiper.el, swiper.activeIndex);
      },
      reachEnd: function (swiper) {
        setTimeout(() => {
          if (mainSwiper.activeIndex < mainSwiper.slides.length - 1) {
            mainSwiper.slideNext();
            handleInnerSwiper(mainSwiper.activeIndex);
          } else {
            closeModal();
          }
        }, 500);
      },
    },
  });

  innerSwipers[index] = innerSwiper;
}

document.querySelector(".modal-content").addEventListener("click", (e) => {
  const width = e.currentTarget.clientWidth;
  const x = e.clientX;
  const activeInner = document.querySelector(".swiper-slide-active .inner-swiper")?.swiper;
  if (!activeInner) return;

  if (x < width / 2) {
    if (activeInner.activeIndex > 0) activeInner.slidePrev();
    else mainSwiper.slidePrev();
  } else {
    if (activeInner.activeIndex < activeInner.slides.length - 1) {
      activeInner.slideNext();
    } else {
      if (mainSwiper.activeIndex < mainSwiper.slides.length - 1) {
        mainSwiper.slideNext();
        handleInnerSwiper(mainSwiper.activeIndex);
      } else {
        closeModal();
      }
    }
  }
});

function debug(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  debugWrapper.appendChild(el);
}


//posts
var POSTS_DATA = (function() {
  // list of posts grouped by country 
  var stories = [
    { name: "RSA", flag: "images/flag/rsa.jpg", posts: ["images/malvaPud.jpg","images/bobotie.jpg","images/koesister.jpg","images/rooiboosTea.jpg","images/amasi.jpg","images/bunnyChow.jpg"] },
    { name: "Turkiye", flag: "images/flag/turkey.jpg", posts: ["images/kebab.jpg","images/baklava.jpg","images/ayran.jpg"] },
    { name: "Morocco", flag: "images/flag/morocco.jpg", posts: ["images/tagine.jpg","images/chebakia.jpg","images/theLaAMenthe.jpg"] },
    { name: "Argentina", flag: "images/flag/argentina.jpg", posts: ["images/asados.jpg","images/yerbaMate.jpg","images/pancake.jpg"] },
    { name: "France", flag: "images/flag/france.jpg", posts: ["images/coqAuVin.jpg","images/cremeBrule.jpg","images/citronPrese.jpg"] },
    { name: "Italy", flag: "images/flag/italy.jpg", posts: ["images/pannaCotta.jpg","images/chinotto.jpg","images/risotto.jpg","images/tiramisu.jpg","images/lasagna.jpg","images/espresso.jpg"] },
    { name: "USA", flag: "images/flag/usa.jpg", posts: ["images/sweetTea.jpg","images/bbqRibs.jpg","images/applepie.jpg"] }
  ];

  // categories mapping 
  var drinks = ["sweetTea.jpg","espresso.jpg","chinotto.jpg","citronPrese.jpg","yerbaMate.jpg","theLaAMenthe.jpg","ayran.jpg","rooiboosTea.jpg","amasi.jpg"];
  var desserts = ["cremeBrule.jpg","pannaCotta.jpg","tiramisu.jpg","applepie.jpg","malvaPud.jpg","koesister.jpg","baklava.jpg","chebakia.jpg","pancake.jpg"];
  var foods = ["coqAuVin.jpg","risotto.jpg","lasagna.jpg","bbqRibs.jpg","bunnyChow.jpg","bobotie.jpg","kebab.jpg","tagine.jpg","asados.jpg"];

  // determine category by file name
  function catForFilename(fn){
    if(!fn) return "food";
    var name = fn.split("/").pop();
    if(drinks.indexOf(name) !== -1) return "drink";
    if(desserts.indexOf(name) !== -1) return "dessert";
    return "food";
  }

  var posts = [];
  for(var i=0;i<stories.length;i++){
    var country = stories[i];
    for(var j=0;j<country.posts.length;j++){
      var img = country.posts[j];
      posts.push({
        country: country.name,
        flag: country.flag,
        image: img,
        category: catForFilename(img)
      });
    }
  }

  return { posts: posts };
})();


function randomDate(){
  var days = Math.floor(Math.random()*6)+1;
  if(days === 1) return "1 day ago";
  return days + " days ago";
}

function randomLikes(){
  return Math.floor(Math.random()*500)+30;
}

function randomReview(category){
  var reviews = {
    food: [
      "4 stars! Bold flavours and excellent textures — I’d eat this again.",
      "3 statrs!Really satisfying — authentic and hearty.",
      "2 stars! A touch salty but overall great comfort food.",
      "5 stars! Perfectly seasoned and beautifully presented."
    ],
    dessert: [
      "5 stars! Velvety, perfectly sweet — 10/10 dessert.",
      "4 stars! Light, airy and just the right amount of sweetness.",
      "4 stars! A decadent treat — rich and sublime.",
      "3 stars! Satisfying and nostalgic, reminds me of grandma's kitchen."
    ],
    drink: [
      "4 stars! So refreshing — hits the spot.",
      "3 stars! Perfect balance of flavour and chill.",
      "4 stars! A pleasant surprise; very drinkable.",
      "5 stars! Delightfully refreshing with subtle notes."
    ]
  };

  var list = reviews[category] || reviews.food;
  return list[Math.floor(Math.random()*list.length)];
}


function fetchPosts(category){
  return new Promise(function(resolve){
    var all = POSTS_DATA.posts.slice(0); // clone
    var out = [];

    if(!category || category === "getAll" || category === "all"){
      out = all;
    } else if(category === "getFood" || category === "food"){
      out = all.filter(function(p){ return p.category === "food"; });
    } else if(category === "getDessert" || category === "dessert"){
      out = all.filter(function(p){ return p.category === "dessert"; });
    } else if(category === "getDrink" || category === "drink"){
      out = all.filter(function(p){ return p.category === "drink"; });
    } else {
      
      out = all;
    }


    out.sort(function(){ return 0.5 - Math.random(); });

    
    setTimeout(function(){ resolve(out); }, 120);
  });
  
}

/* ===== displayPosts  ===== */
function displayPosts(data){
  var output = "";
  var postsContainer = document.getElementById("Posts");

  for(var a=0; a<data.length; a++){
    var post = data[a];
    var likes = randomLikes();
    var when = randomDate();
    var caption = randomReview(post.category);

    output += `
      <div class="post card shadow-sm border-0">
        <div class="card-header bg-transparent border-0 d-flex align-items-center">
          <img src="${post.flag}" class="rounded-circle me-2" width="40" height="40" />
          <div>
            <h6 class="mb-0 fw-bold">${post.country}</h6>
            <div class="meta">${when}</div>
          </div>
        </div>

        <img src="${post.image}" class="card-img-top" alt="${post.country} Post" />

        <div class="card-body p-3">
          <div class="icon-row">
            <button type="button" class="icon-btn btn-like" data-liked="false" data-index="${a}">
              <i class="far fa-heart"></i>
            </button>
            <button type="button" class="icon-btn btn-comment" data-index="${a}">
              <i class="far fa-comment"></i>
            </button>
            <button type="button" class="icon-btn btn-share" data-index="${a}">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>

          <p class="likes">Liked by <strong>LocalFoodie</strong> and <strong>${likes} others</strong></p>
          <p class="caption"><strong>${post.country}</strong> — ${caption}</p>
          <p class="timestamp">${when}</p>
        </div>
      </div>
    `;
  }

  postsContainer.innerHTML = output;
}


function getFood(){
  var category = "getFood";
  fetchPosts(category).then(function(data){
    displayPosts(data);
  });
  setActiveLink("food");
}

function getDessert(){
  var category = "getDessert";
  fetchPosts(category).then(function(data){
    displayPosts(data);
  });
  setActiveLink("dessert");
}

function getDrink(){
  var category = "getDrink";
  fetchPosts(category).then(function(data){
    displayPosts(data);
  });
  setActiveLink("drink");
}


function init(){
  fetchPosts("getAll").then(function(data){
    displayPosts(data);
  });

  
  var elFood = document.getElementById("food");
  if(elFood) elFood.addEventListener("click", getFood);

  var elDessert = document.getElementById("dessert");
  if(elDessert) elDessert.addEventListener("click", getDessert);

  var elDrink = document.getElementById("drink");
  if(elDrink) elDrink.addEventListener("click", getDrink);

  var elHome = document.getElementById("home");
  if(elHome) elHome.addEventListener("click", init);

 
  var postsContainer = document.getElementById("Posts");
  if(postsContainer){
    postsContainer.addEventListener("click", function(e){
      var likeBtn = e.target.closest(".btn-like");
      if(likeBtn){
        var liked = likeBtn.getAttribute("data-liked") === "true";
        if(liked){
          likeBtn.setAttribute("data-liked", "false");
          likeBtn.classList.remove("liked");
          likeBtn.querySelector("i").classList.remove("fas");
          likeBtn.querySelector("i").classList.add("far");
        } else {
          likeBtn.setAttribute("data-liked", "true");
          likeBtn.classList.add("liked");
          likeBtn.querySelector("i").classList.remove("far");
          likeBtn.querySelector("i").classList.add("fas");
        }
        return;
      }

      var commentBtn = e.target.closest(".btn-comment");
      if(commentBtn){
        alert("Comments are not implemented in this demo.");
        return;
      }

      var shareBtn = e.target.closest(".btn-share");
      if(shareBtn){
        alert("Share action");
        return;
      }
    });
  }
}

function setActiveLink(id){
  var ids = ["home","food","dessert","drink"];
  for(var i=0;i<ids.length;i++){
    var el = document.getElementById(ids[i]);
    if(!el) continue;
    el.classList.remove("active");
  }
  var sel = document.getElementById(id);
  if(sel) sel.classList.add("active");
}


window.init = init;


/* ==== MODAL CONTROL ==== 



const swiperModal = document.querySelector(".swiper-modal");
const storiesContainer = document.querySelector(".stories");
const bottomTab = document.querySelector(".bottomTab");

document.querySelectorAll(".story").forEach(story => {
  if (e.target.closest(".swiper-modal") && !e.target.closest(".swiper-slide")) {
    swiperModal.classList.remove("active");
    storiesContainer.setAttribute('hidden', 'true');
    bottomTab.removeAttribute('hidden', 'true');
  }
});

document.addEventListener("click", e => {
  if (e.target.closest(".swiper-modal") && !e.target.closest(".swiper-slide")) {
    swiperModal.classList.remove("active");
    storiesContainer.removeAttribute('hidden');
    bottomTab.removeAttribute('hidden');
  }
});*/