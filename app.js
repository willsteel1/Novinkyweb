fetch("https://kodi-novinky-api.onrender.com/novinky?key=tajnykluc123")
  .then(res => res.json())
  .then(data => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const sections = {
      "Filmy CZ": item => item.type === 'film' && item.lang === 'cz',
      "Filmy SK": item => item.type === 'film' && item.lang === 'sk',
      "Seriály CZ": item => item.type === 'serial' && item.lang === 'cz',
      "Seriály SK": item => item.type === 'serial' && item.lang === 'sk'
    };

    Object.entries(sections).forEach(([title, filterFn]) => {
      const section = document.createElement('div');
      section.className = 'section';
      const anchor = document.createElement('a');
      anchor.name = title.replace(/\s+/g, '_');
      section.appendChild(anchor);

      const header = document.createElement('h2');
      header.textContent = title;
      section.appendChild(header);

      const items = data.filter(filterFn);
      const visibleCount = 3;
      let showing = visibleCount;

      const listContainer = document.createElement('div');
      const showItems = () => {
        listContainer.innerHTML = '';
        items.slice(0, showing).forEach(item => {
          const el = document.createElement('div');
          el.className = 'item';
          el.innerHTML = `
            ${item.poster ? `<img src="${item.poster}" alt="Poster">` : ''}
            <h3>${item.title}</h3>
            <small>${item.date || 'Neznámy dátum'} | ${item.genres?.join(', ') || 'Žáner neznámy'}</small>
            <p>${item.description || 'Bez popisu'}</p>
          `;
          listContainer.appendChild(el);
        });
      };
      showItems();

      const moreBtn = document.createElement('button');
      moreBtn.className = 'more-btn';
      moreBtn.textContent = 'Zobraziť viac';
      moreBtn.onclick = () => {
        showing += visibleCount;
        if (showing >= items.length) moreBtn.style.display = 'none';
        showItems();
      };

      const backBtn = document.createElement('button');
      backBtn.className = 'back-btn';
      backBtn.textContent = 'Späť hore';
      backBtn.onclick = () => window.scrollTo({ top: section.offsetTop - 50, behavior: 'smooth' });

      section.appendChild(listContainer);
      if (items.length > visibleCount) section.appendChild(moreBtn);
      section.appendChild(backBtn);

      content.appendChild(section);
    });
  })
  .catch(err => {
    document.getElementById('content').innerText = 'Chyba pri načítavaní dát.';
    console.error(err);
  });
