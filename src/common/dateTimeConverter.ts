export const dateTimeConverter = {
  convertTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    // Farqni kunlarda hisoblash
    const dayDifference = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Oylik qisqartmalar
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Soat va daqiqalarni olish
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Bugungi kun
    if (dayDifference === 0) {
      return `Today, ${hours}:${minutes}`;
    }
    // Kecha
    else if (dayDifference === 1) {
      return `Yesterday, ${hours}:${minutes}`;
    }
    // Kechadan oldin
    else {
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      return `${day} ${month}, ${hours}:${minutes}`;
    }
  }
};
