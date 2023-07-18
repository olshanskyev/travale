
export class RussianLanguage {

    public static getTranslations(): object {
        return {
            common: {
                error: 'Ошибка',
                warning: 'Внимание',
                info: 'Информация',
                done: 'OK',
                back: 'Назад'
            },

            login: {
                email: 'Электронная почта',
                emailAdress: 'Адрес электронной почты',
                password: 'Пароль',
                forgotPassword: 'Забыли пароль?',
                rememberMe: 'Запомнить',
                helloLogin: 'Привет! Укажите E-mail для входа',
                login: 'Вход',
                emailRequired: 'Введите адрес электронной почты',
                realEmail: 'Необходимо ввести настоящий адрес',
                passwordRequired: 'Необходимо ввести пароль',
                passwordShouldContain: 'Пароль должен содержать от {{from}} до {{to}} символов',
                Log_In: 'Войти',
                dontHaveAccount: 'Ещё нет аккаунта?',
                register: 'Зарегистрироваться',
                hooray: 'Ура!',
                snap: 'Ошибочка вышла',
                tryAgain: 'Попробуйте еще раз',
                successMessage: 'Вход выполнен',
            },
            register: {
                register: 'Зарегистрироваться',
                successMessage: 'Письмо с запросом на регистрацию отправлено. Ожидайте подтверждения на email',
                firstName: 'Имя',
                lastName: 'Фамилия',
                firstNameRequired: 'Введите имя',
                lastNameRequired: 'Введите фамилию',
                firstNameShouldContain: 'Поле Имя должно содержать от {{from}} до {{to}} символов',
                lastNameShouldContain: 'Поле Фамилия должно содержать от {{from}} до {{to}} символов',
                alreadyHaveAccount: 'Уже зарегистрированы',
                agreeTo: 'Согласен с',
                termsAndConditions: ' Условиями пользования',

            },
            resetPass: {
                newPassword: 'Новый пароль',
                setNewPassword: 'Пожалуйста, задайте новый пароль',
                successMessage: 'Пароль успешно изменен',
                passwordConfirmRequired: 'Необоходимо подтвердить пароль',
                passwordsNotMatch: 'Пароли не совпадают',
                confirmPassword: 'Подтвердить пароль',
                somethingWentWrong: 'Что-то пошло не так, невозможно задать новый пароль. Для восстановления пароля перейдите по ссылке из письма.',
                changePassword: 'Изменить пароль',
                backToLogin: 'Вернуться на страницу входу',
            },
            requestPass: {
                successMessage: 'Запрос на восстановление пароля выслан на почту',
                forgotPassword: 'Забыли пароль?',
                somethingWentWrong: 'Что-то пошло не так, обратитесь к администратору.',
                enterEmail: 'Введите ваш email',
                requestPassword: 'Запросить пароль',
                enterEmailWillSendPass: 'Введите ваш адрес электронной почты и мы вышлем ссылку для задания нового пароля',
            },
            menu: {
                Destinations: 'Места',
                NewDestination: 'Добавить новое место',
                Map: 'Карта',
                CreateRoute: 'Создать маршрут'
            },
            searchDestinationInput: {
                searchForDestination: 'Поиск места',
                popularDestinations: 'Популярные места',
                city: 'город',
                country: 'страна'

            },

            selectCountryMap: {
                selectCountry: 'Выбираем страну'
            },
            leafletMap: {
                artwork: 'Произведение искусства',
                attraction: 'Достопримечательность',
                gallery: 'Галерея',
                information: 'Информация',
                museum: 'Музей',
                theme_park: 'Тематический парк',
                viewpoint: 'Смотровая площадка',
                zoo: 'Зоопарк',
                castle: 'Замок',
                castle_wall: 'Крепостные стены',
                church: 'Церковь',
                city_gate: 'Городские ворота',
                citywalls: 'Городские стены',
                memorial: 'Мемориал',
                monument: 'Монумент',
                tower: 'Башня',
                archaeological_site: 'Археологические раскопки',
                select_all: 'Выбрать все',
                pois: 'Объекты на карте',
                routes: 'Маршруты'
            },

            imgSlider: {
                dropImagesHereOr: 'Перетащите сюда изображения или',
                browseFiles: 'выберите файлы',
                errors: {
                    isNotAFile: '{{name}} не является файлом',
                    notAllowedFileType: 'Данный тип файла не поддерживается'
                }
            },

            createRoute: {
                addRouteSubheading: 'Добавить подзаголовок',
                routeTitle: 'Название маршрута',
                generalInformation: 'Общая информация',
                writeGeneralInformationHere: 'Добавьте общую информацию о маршруте, советы и рекомендации',
                selectPlaceOnMap: 'Выберите место на карте и добавьте его в маршрут',
                newRouteIn: 'Новый маршрут в '
            },
            searchPlaceControl: {
                searchForPlace: 'Поиск...'
            },
            placeCard: {
                placeTitle: 'Заголовок места',
                placeDescription: 'Описание места'
            },
            citySelectWindow: {
                selectCity: 'Выберите город'
            }


        };
    }
}