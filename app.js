// импортируем ky, потому что я не хочу писать обёртку над fetch
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.33.2/distribution/index.min.js'

// Адрес нашего API (громкое название для одного PHP файла конечно)
const api = 'http://localhost:8000'

// Выберем элементы на странице
const messageText = document.querySelector('#message')
const errorText = document.querySelector('#error')
const cratesList = document.querySelector('#crates')
const bottlesInput = document.querySelector('#bottlesInput')


bottlesInput.addEventListener('keyup', async (e) => {
    resetElements()
    const bottles = e.target.value
    if (!bottles) {
        return
    }

    try {
        const response = await ky.get(`${api}?bottles=${bottles}`).json()
        if (response.error) {
            errorText.innerHTML = response.error
            errorText.classList.remove('hidden')
            return
        }
        const data = response.data

        if (data.message) {
            messageText.innerHTML = data.message
            messageText.classList.remove('hidden')
        }

        const cratesListEntries = data.crates.map((item) => {
            return `<li><strong>Ящики по ${item.tare}:</strong> ${item.crates}</li>`
        }).join('')
        console.log(data)
        cratesList.innerHTML = `
            <strong>Бутылок к отгрузке:</strong> ${data.bottles}
            <br><br>
            <ul>
                ${cratesListEntries}
            </ul>
        `
        cratesList.classList.remove('hidden')
    } catch (error) {
        // Не хочу сильно расписывать ошибки, просто выведем её в сообщение
        errorText.classList.remove('hidden')
        errorText.innerHTML = error
    }
})

function resetElements() {
    cratesList.innerHTML = ''
    cratesList.classList.add('hidden')
    errorText.innerHTML = ''
    errorText.classList.add('hidden')
    messageText.innerHTML = ''
    messageText.classList.add('hidden')
}
