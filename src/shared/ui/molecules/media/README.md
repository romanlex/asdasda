### Media компонент

Рендерит дочерний компонент на определенном устройстве.
Использует под капотом `window.matchMedia` и `effector`

Использует брэйкпоинты из темы `shared/ui/themes`

Пропсы
```js
<Media extraSmall>мелкие мобилки</Media>
<Media small>мобилки</Media>
<Media medium>планшеты</Media>
<Media large>мелкий десктоп</Media>
<Media extraLarge>десктоп</Media>
```

Алиасы
```js
<Media mobile>алиас для пропсов extraSmall, small</Media>
<Media desktop>алиас для пропсов large, extraLarge</Media>
<Media tablet>алиас для пропсы medium</Media>
<Media tablet desktop>алиас для пропсы medium, large, extraLarge</Media>
```

Также есть возможность отображать компонент только на определенной ориентации устройства

```js
<Media portrait>портретная ориентация</Media>
<Media landscape>альбомная ориентация</Media>
```

Вы можете использовать Media на уровне своего компонента для кастомных пропсов или выбора типа элемента(дом-ноды)

```js static
import { screenQueries } from 'molecules/media/model/store'

const Component = () => {
  const queries = useStore(screenQueries)
  const Wrapper = queries.large || queries.extraLarge ? 'div' : 'span'

  return <Wrapper>контент</Wrapper>
}
```

Также можно использовать стор медиа матчера на слое БЛ в эффекторе, чтобы разделить вычисления в БЛ по типу устройства

```js static
import { screenQueries } from 'molecules/media/model/store'

guard({
  source: event,
  filter: screenQueries.map(mq => mq.large || mq.extraLarge),
  target: desktopEvent,
})
```
