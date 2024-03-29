# Задание 1 — найди ошибки

В этом репозитории находятся материалы тестового задания "Найди ошибки" для [14-й Школы разработки интерфейсов](https://academy.yandex.ru/events/frontend/shri_msk-2018-2) (осень 2018, Москва, Санкт-Петербург, Симферополь).

Для работы тестового приложения нужен Node.JS v9. В проекте используются [Yandex Maps API](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/) и [ChartJS](http://www.chartjs.org).

## Задание

Код содержит ошибки разной степени критичности. Некоторые из них — стилистические, а другие — даже не позволят вам запустить приложение. Вам нужно найти все ошибки и исправить их.

Пункты для самопроверки:

1. Приложение должно успешно запускаться.
1. По адресу http://localhost:9000 должна открываться карта с метками.
1. Должна правильно работать вся функциональность, перечисленная в условиях задания.
1. Не должно быть лишнего кода.
1. Все должно быть в едином codestyle.

## Запуск

```
npm i
npm start
```

При каждом запуске тестовые данные генерируются заново случайным образом.

Задание «Комплексное» («Найди ошибки»)
Представьте, что вы инженер в большом интернет-магазине и отвечаете за доставку заказов дронами.

В каждый момент времени в воздухе находится несколько сотен дронов. Для управления ими развёрнута сеть базовых станций. В ваших обязанностях — контроль работоспособности станций и устранение неисправностей. Для этого есть специальное приложение, в котором на карте города показаны места размещения базовых станций и информация о них.

Репозиторий на GitHub
К сожалению, после очередного релиза вашего приложения данные на карте перестали отображаться. Кажется, программисты опять понаделали ошибок в коде. Нужно скорее найти ошибки и починить их.

Описание
Всю область экрана занимает интерактивная карта Москвы.
На карте отображаются места размещения базовых станций.
++++ Если на небольшом пространстве много объектов, они объединяются в кластер.
++++ При клике на кластер карта масштабируется для просмотра объектов, входящих в него.
++++ Неисправные станции обозначаются на карте красным цветом, исправные — синим.
++++ Используя фильтр, можно отобразить на карте объекты с нужным состоянием — например, отобразить только неисправные
++++ Если неисправный объект входит в кластер, то иконка кластера должна показывать, что в нем есть неисправная станция.
++++ При клике на метку базовой станции появляется попап с информацией о ней: серийный номер, состояние, количество
активных дронов, график нагрузки.
Техническое описание
Приложение работает в браузере и написано на JavaScript, модули собираются с помощью Webpack.
Для отображения карты используется API Яндекс.Карт.
Для для отображения графиков используется Chart.js.



Привет, вот моя история поиска и исправления ошибок:

1) При сборке вылетела ошибка, что модуль map.js не экспортирован
   (просто неправильно написали экспорт)
   путей решения 2:
   Или дописать в map.js default рядом с экспортом
   Или переписать импорт в index.js с import initMap на import { initMap }
   Выбрал первый вариант.

2) Добавил в вебпак devtool: 'source-map', дебажил в webstorm, мы же не в каменном веке писать console.log,
   поэтому вкупе к ide добавил строчку в .gitingore, чтобы скрыть ide файлы при коммите.

3) При включенной source-map начал бегать по коду, без особого вникания в документацию и сразу увидел багу в промисах, в
 функции loadList(). Последний then ничего не возрашал, там была просто ссылка на функцию mapServerData, поправил на
 json =>mapServerData(json), но карта все равно не отрисовывалась.

4) Закоментировал весь код в initMap(), кроме инициализации карты, она все равно не отрисовывалась, ошибок не было,
   посмотрел документацию, все норм, проверил, что инициализация скриптов после div#map, и тут наконец таки открыл
   консоль в хроме. Посмотрел на этот div#map, да он же с нулевой высотой! Прописал в стилях высоту карты в 100%.

5) В этот момент обрадовался, карта отрисовалась, но точек не было, посмотрел что нам говорит вебпак, а он говорит, что
что-то появилась проблема с chart.js, снова проблема с импортом, поправил import { Chart } на Chart - заработало

6) Поправил генерацию точек после просмотра видео на ютубе про ШРИ, они генерировались далеко не в Москве,
   P.S. Спасибо Дмитрию Андрияну за подсказку

7) Но координаты все равно не отрисовывались, решил посмотреть документацию, и нашел, что добавление точек в
objectManager не добавляет их на карту, что логично, дописал в промисе loadList().then(...) добавление objectManager на
карту

8) Начал думать, как реализовать логику закраски кластеров в зависимости от наличия в нем неактивных станций.
Понял, что строчка objectManager.clusters.options.set('preset'...), задает стили, но задает их для всех сразу. Начал
копать в документации objectManager.clusters необходимые методы. Нашел, добавил событие при создании, создал фильтр для
кластера с отключенной станцией в файле cluster.js и заюзал его.

9) При клике на балун выпадала ошибка, достаточно долго пытался что-то менять в коде map.js файла,
безрезультатно. Оказалось все просто, просто надо прочитать документацию про objectManager внимательно. Понял, что дело
в фабрике балуна. Написал на стрелочных функциях метод destroy() по аналогии, но не работало, однако ошибка была уже
другой. В итоге нашел в песочнице пример, где события были реализованы не на стрелочных функциях, попробовал, получилось,
понял, что терялся контекст.

10) Балун открывается, но график пустой, видно, что ось по y установлена максимальной в 0, убираем параметр max из
конфигурации масшаба в chart.js

11) Так и не понял зачем файл popup.js, функции из него нигде не используются, удалил.

12) Прогнал код через eslint

Спасибо за задание!
