(async()=>{
  const tmpl = await `
  <h1>Таблица в формате Single Page Application</h1>
  <div class='myForm'>
    <select class="oneFilter">
      <option value="columnAll">Выбрать столбец</option>
      <option value="nameProduct">Название</option>
      <option value="quantity">Количество</option>
      <option value="distance">Расстояние</option>
    </select>
    <select class="twoFilter">
      <option value="paramAll">Выбрать условие</option>
      <option value="equalTo">Равно</option>
      <option value="contains">Содержит</option>
      <option value="greaterThan">Больше</option>
      <option value="lessThan">Меньше</option>
    </select>
    <input type="text" class="textFilter">
    <button class="btn-filter no-active">Фильтровать</button>
  </div>
  <div class="table">
  <table>
    <tr>
      <th>ИД</th>
      <th>Дата</th>
      <th>Название</th>
      <th>Количество</th>
      <th>Расстояние</th>  
    </tr>
  </table>
  <p class="message"></p>
  </div>
  <div class="pagination" data-page="0">
    <ul>
    </ul>
  </div>
  `
  const App = await document.querySelector('#app')
  App.innerHTML = await tmpl
  // Константы формы и элементов
  const myForm = await document.querySelector('.myForm')
  const oneSelect = await document.querySelector('.oneFilter')
  const twoSelect = await document.querySelector('.twoFilter')
  const oneOptions = await oneSelect.children
  const twoOptions = await twoSelect.children
  const textInput = await document.querySelector('.textFilter')
  const button = await document.querySelector('.btn-filter')
  const table = await document.querySelector('table')
  const message = await document.querySelector('p.message')
  const pagination = await document.querySelector('.pagination')
  const ul = await document.querySelector('ul')

  if (sessionStorage.getItem("oneSelect")) {
    // Восстанавливаем содержимое текстового поля
    oneSelect.value = await sessionStorage.getItem("oneSelect");
  }
  if (sessionStorage.getItem("twoSelect")) {
    // Восстанавливаем содержимое текстового поля
    twoSelect.value = await sessionStorage.getItem("twoSelect"); 
  }
  if (sessionStorage.getItem("textInput")) {
    // Восстанавливаем содержимое текстового поля
    textInput.value = await sessionStorage.getItem("textInput");
  }

  // Функция-событие для запроса и вывода данных.
  const handDefault = async (e)=>{
    try { 
      // Если нажимаем на кнопку "Фильтровать", то атрибут "data-page='0'"
      // Атрибут "data-page" регулирует вывод определенной страницы.
      if(e.target === button) {
        pagination.dataset.page = "0"
      }

      const url = await `/php/default.php`
      let data = {
        a: oneSelect.value,
        b: twoSelect.value,
        c: textInput.value,
        d: pagination.dataset.page
      }
      // Создание сессий для сохранения заданных параметров
      sessionStorage.setItem("oneSelect", oneSelect.value);
      sessionStorage.setItem("twoSelect", twoSelect.value);
      sessionStorage.setItem("textInput", textInput.value);
    
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'aplication/json;charset=UTF-8'
        }
      })
      if(response.ok) {
    
        const json = await response.json()

        if(json.length != 0) {
          // Перед новым запросом очищаем старые данные в таблице.
          message.innerHTML = ''
          table.innerHTML = ''
          // Добавляем новые данные с HTML-кодом.
          table.innerHTML += await `
          <tr>
            <th>ИД</th>
            <th>Дата</th>
            <th>Название</th>
            <th>Количество</th>
            <th>Расстояние</th>  
          </tr>
          `
          for(let i=0; i<json.length; i++) {
            table.innerHTML += await `
            <tr>
              <td>${json[i].id}</td>
              <td>${json[i].date}</td>
              <td>${json[i].name_product}</td>
              <td>${json[i].quantity}</td>
              <td>${json[i].distance}</td>
            </tr>
            `
          }
          // Перед новым запросом очищаем старые данные в пагинации.
          ul.innerHTML = ''
          // Если количество страниц больше или равно 2, то выводим кнопку Prev
          if(json[0][0] >= 2) {
            ul.innerHTML += await '<li><a class="prev">Prev</a</li>'
          }
          // Добавляем кнопки пагинации.
          for(let j = 0; j < json[0][0]; j++) {
            ul.innerHTML += await '<li><a class="link">'+(j+1)+'</a</li>'
          }
          // Если количество страниц больше или равно 2, то выводим кнопку Next
          if(json[0][0] >= 2) {
            ul.innerHTML += await '<li><a class="next">Next</a</li>'
          }
          // Если кнопка Prev существует, то ее скрываем.
          if(document.querySelector('.prev') != null) {
            const prevElem = await document.querySelector('.prev')
            prevElem.style.display = 'none'
          } 
          // Если кнопка Next существует, то ее скрываем.
          if(document.querySelector('.next') != null) {
            const nextElem = await document.querySelector('.next')
            nextElem.style.display = 'none'
          } 

          // В выбраные <option> в <select> устанавливаем атрибут "selected"
          oneOptions[oneSelect.selectedIndex].setAttribute('selected', true)
          twoOptions[twoSelect.selectedIndex].setAttribute('selected', true)
        
          // Кнопки пагинации, для выбранной кнопки даем другой цвет.
          const link = await document.querySelectorAll('.link')
          if(link.length != 0) {
            link[pagination.dataset.page].style.backgroundColor = 'pink'
          }
    
          // Функция-событие, которое изменяет значение атрибута data-page,
          // в соответствии c нажатой кнопкой-ссылкой в пагинации 
          const funcPagination = async (e)=>{
            pagination.dataset.page = await e.target.textContent - 1
          }
          // Устанавливаем события для кнопок пагинации и скрываем их на время.
          for(let l = 0; l < link.length; l++) {
            link[l].addEventListener('click', funcPagination)
            link[l].addEventListener('click', handDefault)
            link[l].style.display = 'none'
          }
          // Ниже условия для работы пагинации и вывода данных c HTML-кодом.
          // Находим номер страницы, которая находится по середине общего числа страниц
          let pol = json[0][0] / 2
          // Если кнопка пагинации равна номеру атрибута "data-page" + 1, то
          if(link[pagination.dataset.page].innerHTML == Number(pagination.dataset.page) + 1) {
            // Если страниц больше или равно 5, то
            if(json[0][0] >= 5) {
              // Функция-событие для кнопки Prev, устанавливает атрибут "data-page='0'"
              const handPrev = async (e)=>{
                pagination.dataset.page = await link[0].innerHTML - 1
              }
              // Функция-событие для кнопки Next, устанавливает атрибут "data-page" на последнюю страницу.
              const handNext = async (e)=>{
                pagination.dataset.page = await json[0][0] - 1
              }
              // Если кнопка Prev не равна null ,то
              if(document.querySelector('.prev') != null) {
                const prevElem = await document.querySelector('.prev')
                // Скрываем кнопку Prev
                prevElem.style.display = 'none'
                // Если текущая кнопка пагинации более 4-й, то делаем ее видимой.
                if(link[pagination.dataset.page].innerHTML >= 4) {
                  prevElem.style.display = 'inline-block'       
                }
                // Устанавливаем события для кнопки Prev
                prevElem.addEventListener('click', handPrev)
                prevElem.addEventListener('click', handDefault)
                      
              }
              // Если кнопка Next не равна null ,то
              if(document.querySelector('.next') != null) {
                const nextElem = await document.querySelector('.next')
                // Скрываем кнопку Next
                nextElem.style.display = 'none' 
                // Если текущая кнопка пагинации меньше последней страницы - 3,то
                // делаем ее видимой.
                if(link[pagination.dataset.page].innerHTML <= json[0][0] - 3) {
                  nextElem.style.display = 'inline-block'    
                } 
                // Устанавливаем события для кнопки Next
                nextElem.addEventListener('click', handNext)
                nextElem.addEventListener('click', handDefault)
              }

              // Если текущий номер страницы более или равно половину страниы, то
              // отображаем ее и еще две предыдущие.  
              if(link[pagination.dataset.page].innerHTML >= pol) {
                link[Number(pagination.dataset.page)].style.display = 'inline-block'
                link[Number(pagination.dataset.page) - 1].style.display = 'inline-block'
                link[Number(pagination.dataset.page) - 2].style.display = 'inline-block'
              }
              // Если текущий номер страницы менее или равно половину страниы, то
              // отображаем ее и еще две последующие.  
              if(link[pagination.dataset.page].innerHTML <= pol) {
                link[Number(pagination.dataset.page)].style.display = 'inline-block'
                link[Number(pagination.dataset.page) + 1].style.display = 'inline-block'
                link[Number(pagination.dataset.page) + 2].style.display = 'inline-block'
              }
              // Если текущий номер страницы более или равно 0, то отображаем ее.  
              if(link[pagination.dataset.page].innerHTML >= 0) {
                link[Number(pagination.dataset.page)].style.display = 'inline-block'
                // Если текущий номер страницы меньше последней минус 1, то
                // отображем ее добавляя в ключи + 1
                if(link[pagination.dataset.page].innerHTML <= json[0][0] - 1) {
                  link[Number(pagination.dataset.page) + 1].style.display = 'inline-block' 
                }
                // Если текущий номер страницы меньше последней минус 2, то
                // отображем ее добавляя в ключи + 2
                if(link[pagination.dataset.page].innerHTML <= json[0][0] - 2) {
                  link[Number(pagination.dataset.page) + 2].style.display = 'inline-block' 
                }
              }
              // Если текущий номер страницы меньше или равно последней, то отображаем ее.  
              if(link[pagination.dataset.page].innerHTML <= json[0][0]) {
                link[Number(pagination.dataset.page)].style.display = 'inline-block'
                // Если текущий номер страницы больше первой, то
                // отображем ее уменьшая ключ на единицу.
                if(link[pagination.dataset.page].innerHTML > 1) {
                  link[Number(pagination.dataset.page) - 1].style.display = 'inline-block' 
                }
                // Если текущий номер страницы больше второй, то
                // отображем ее уменьшая ключ на две единицы.
                if(link[pagination.dataset.page].innerHTML > 2) {
                  link[Number(pagination.dataset.page) - 2].style.display = 'inline-block' 
                }
              }
            // Иначе выводим первые четыре кнопки пагинации, если они не равны undefined.
            } else {
              
              link[0].style.display = 'inline-block'
            
              if(link[1] != undefined) {
                link[1].style.display = 'inline-block' 
              }   
              if(link[2] != undefined) {
                link[2].style.display = 'inline-block' 
              }
              if(link[3] != undefined) {
                link[3].style.display = 'inline-block' 
              }
            }
          }
        // Если ничего не найдено, то выводим сообщение и очищаем HTML-код 
        // с динамическими данными.
        } else {
          message.innerHTML = 'Данные отсутствуют!'
          table.innerHTML = ''
          ul.innerHTML = ''
    
        } 
      } 

    } catch(e) {
        console.log(e.name)
        console.log(e.message)   
    }
  }
  // Установка событий для кнопки "Фильтровать" и по умолчанию, после перезагрузки.
  button.addEventListener('click', handDefault)
  window.addEventListener('load', handDefault)

})()