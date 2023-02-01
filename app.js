// импортируем ky, потому что я не хочу писать обёртку над fetch
import ky from 'https://cdn.jsdelivr.net/npm/ky@0.33.2/distribution/index.min.js'

// Адрес нашего API (громкое название для одного PHP файла конечно)
const api = 'http://localhost:8000'

// Выберем элементы на странице
const messageText = document.querySelector('#message')
const errorText = document.querySelector('#error')
const crates = document.querySelector('#crates')
const bottlesInput = document.querySelector('#bottlesInput')


bottlesInput.addEventListener('keyup', async (e) => {
    resetElements()
    const bottles = e.target.value

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

        console.log(data.crates)

        const cratesList = data.crates.map((key, value) => {
            return `<li><strong>Ящики по ${key}:</strong> ${value}</li>`
        })
        console.log(cratesList)
    } catch (error) {
        // Не хочу сильно расписывать ошибки, просто выведем её в сообщение
        errorText.innerHTML = error
    }
})

function resetElements() {
    crates.innerHTML = ''
    crates.classList.add('hidden')
    errorText.innerHTML = ''
    errorText.classList.add('hidden')
    messageText.innerHTML = ''
    messageText.classList.add('hidden')
}
