(function () {
  // Número do WhatsApp com DDI e DDD, só dígitos (ex.: "5551999999999").
  // Enquanto estiver vazio, os botões levam para o formulário de contato.
  var WHATSAPP = "555196312103";
  var MENSAGEM = "Olá! Vim pelo site e gostaria de um orçamento de paisagismo.";

  if (WHATSAPP) {
    var link = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MENSAGEM);
    document.querySelectorAll(".js-wa").forEach(function (a) {
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener";
      a.hidden = false;
    });
    var line = document.querySelector(".js-wa-line");
    var num = document.querySelector(".js-wa-number");
    if (line && num) {
      var d = WHATSAPP.replace(/^55/, "");
      num.textContent = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      line.hidden = false;
    }
  }

  // Formulário de contato: monta a mensagem e abre no WhatsApp
  var form = document.getElementById("contatoForm");
  var status = document.getElementById("formStatus");
  function setError(input, show) {
    input.classList.toggle("is-invalid", show);
    input.setAttribute("aria-invalid", String(show));
    document.getElementById(input.id + "-erro").hidden = !show;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.elements.nome;
    var mensagem = form.elements.mensagem;
    var nomeVazio = !nome.value.trim();
    var msgVazia = !mensagem.value.trim();
    setError(nome, nomeVazio);
    setError(mensagem, msgVazia);
    if (nomeVazio || msgVazia) {
      (nomeVazio ? nome : mensagem).focus();
      return;
    }
    if (!WHATSAPP) {
      status.textContent = "O WhatsApp ainda não foi configurado. Fale com a gente na Rua Casemiro de Abreu, 707.";
      status.hidden = false;
      return;
    }

    var linhas = [
      "Olá! Vim pelo site da Nature Paisagismo.",
      "",
      "*Nome:* " + nome.value.trim(),
      "*Serviço:* " + form.elements.servico.value
    ];
    var tel = form.elements.telefone.value.trim();
    var bairro = form.elements.bairro.value.trim();
    if (tel) linhas.push("*Telefone:* " + tel);
    if (bairro) linhas.push("*Bairro:* " + bairro);
    linhas.push("", mensagem.value.trim());

    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(linhas.join("\n")), "_blank", "noopener");
    status.textContent = "Abrimos o WhatsApp com a sua mensagem. É só tocar em enviar.";
    status.hidden = false;
  });
  ["nome", "mensagem"].forEach(function (name) {
    form.elements[name].addEventListener("input", function () {
      if (this.value.trim()) setError(this, false);
    });
  });

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu-mobile");

  // Borda no header quando o topo sai da tela
  var sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;height:40px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(function (entries) {
    nav.classList.toggle("is-scrolled", !entries[0].isIntersecting);
  }).observe(sentinel);

  // Menu mobile
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.innerHTML = open ? '<i class="ph ph-x" aria-hidden="true"></i>' : '<i class="ph ph-list" aria-hidden="true"></i>';
  }
  toggle.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  // Entrada dos elementos ao rolar
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Setas do carrossel de depoimentos
  var track = document.querySelector(".reviews__track");
  document.querySelectorAll("[data-scroll]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = track.querySelector(".review");
      var step = card ? card.getBoundingClientRect().width + 16 : 320;
      track.scrollBy({ left: step * Number(btn.dataset.scroll), behavior: "smooth" });
    });
  });

  // FAQ: um item aberto por vez
  var items = document.querySelectorAll(".qa");
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  // Galeria: foto ampliada com setas, teclado e Esc
  var box = document.querySelector(".lightbox");
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot__btn"));
  if (box && shots.length && typeof box.showModal === "function") {
    var boxImg = box.querySelector(".lightbox__img");
    var boxCap = box.querySelector(".lightbox__caption");
    var current = 0;
    var show = function (i) {
      current = (i + shots.length) % shots.length;
      var thumb = shots[current].querySelector("img");
      boxImg.src = shots[current].dataset.full;
      boxImg.alt = thumb.alt;
      boxCap.textContent = thumb.alt;
    };
    shots.forEach(function (btn, i) {
      btn.addEventListener("click", function () { show(i); box.showModal(); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    box.addEventListener("close", function () { boxImg.removeAttribute("src"); });
  }

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
