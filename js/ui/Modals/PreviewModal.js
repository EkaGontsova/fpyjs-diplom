/**
 * Класс PreviewModal
 * Используется как обозреватель загруженных файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения:
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.domElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("x")) {
        this.close();
      } else if (event.target.closest("button.delete")) {
        const deleteButton = event.target.closest("button.delete");
        deleteButton.classList.add("disabled");
        const icon = deleteButton.querySelector("i");
        icon.classList.add("spinner", "loading");

        const path = deleteButton.dataset.path;
        Yandex.removeFile(path, (jsonData) => {
          if (jsonData === null) {
            deleteButton.closest(".image-preview-container").remove();
          }
        });
      } else if (event.target.closest("button.download")) {
        Yandex.downloadFileByUrl(
          event.target.closest("button.download").dataset.file
        );
      }
    });
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    const modalContent = this.domElement.querySelector(".content");
    modalContent.innerHTML = data.items.reverse().reduce((total, image) => {
      return total + this.getImageInfo(image);
    }, "");
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00 (строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   */
  formatDate(date) {
    const formattedDate = new Date(date);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return formattedDate.toLocaleString("ru-RU", options);
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src="${item.preview}" alt="${item.name}"/>
        <table class="ui celled table">
          <thead>
            <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${item.name}</td>
              <td>${this.formatDate(item.created)}</td>
              <td>${(item.size / 1024).toFixed(1)} Кб</td>
            </tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path="${
            item.path
          }">
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file="${
            item.file
          }">
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>`;
  }
}
