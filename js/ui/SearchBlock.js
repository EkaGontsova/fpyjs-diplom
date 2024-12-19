/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.element.addEventListener("click", (event) => {
      const input = this.element.querySelector("input").value.trim();

      if (input) {
        if (event.target.classList.contains("replace")) {
          VK.get(input, (images) => {
            App.imageViewer.clear(); // Очищаем изображения перед заменой
            App.imageViewer.drawImages(images); // Отрисовываем новые изображения
          });
        } else if (event.target.classList.contains("add")) {
          VK.get(input, (images) => {
            App.imageViewer.drawImages(images);
          });
        }
      }
    });
  }
}
