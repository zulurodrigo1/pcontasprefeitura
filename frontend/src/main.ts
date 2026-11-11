import './app.css'

type SettingOption = { value: string; label: string }

function renderImageChoices(
  name: string,
  title: string,
  hint: string,
  options: SettingOption[],
  preview: (value: string) => string,
  columns = 3,
): string {
  return `<div class="setting-group" data-theme-setting="${name}" role="group" aria-labelledby="setting-label-${name}">
    <div class="form-label mb-1" id="setting-label-${name}">${title}</div><div class="form-text mb-3">${hint}</div>
    <div class="row g-3">${options.map(({ value, label }) => `<div class="col-${12 / columns}"><label class="form-imagecheck w-100">
      <input type="radio" name="${name}" value="${value}" class="form-imagecheck-input" aria-label="${label}">
      <span class="form-imagecheck-figure p-1">${preview(value)}<span class="form-imagecheck-caption">${label}</span></span>
    </label></div>`).join('')}</div>
  </div>`
}

function renderColorChoices(): string {
  const colors = ['blue', 'azure', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan', 'inverted']
  return `<div class="setting-group" role="group" aria-labelledby="setting-label-theme-primary">
    <div class="form-label mb-1" id="setting-label-theme-primary">Cor de destaque</div><div class="form-text mb-3">A cor de ênfase usada na interface.</div>
    <div class="d-flex flex-wrap gap-2">${colors.map((color) => `<label class="form-colorinput"><input type="radio" name="theme-primary" value="${color}" class="form-colorinput-input" aria-label="${color}"><span class="form-colorinput-color bg-${color}"></span></label>`).join('')}</div>
  </div>`
}

const schemeOptions = [
  { value: 'auto', label: 'Automático' }, { value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' },
  { value: 'dark-nav', label: 'Navegação escura' }, { value: 'colored', label: 'Colorido' },
]
const baseOptions = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'mist'].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
const radiusOptions = ['0', '0.5', '1', '1.5', '2'].map((value, index) => ({ value, label: ['Sem raio', 'Pequeno', 'Padrão', 'Grande', 'Extra grande'][index] }))
const fontOptions = ['sans-serif', 'serif', 'monospace', 'comic'].map((value) => ({ value, label: value === 'comic' ? 'Comic' : value }))
const svgPreview = (value: string) => `<svg class="setting-preview-image" viewBox="0 0 96 64" aria-hidden="true"><rect x=".5" y=".5" width="95" height="63" rx="6" fill="var(--tblr-bg-surface-secondary)" stroke="var(--tblr-border-color)"/><rect x="8" y="8" width="80" height="12" rx="3" fill="var(--tblr-primary)"/><rect x="10" y="29" width="50" height="5" rx="2.5" fill="var(--tblr-border-color)"/><rect x="10" y="40" width="70" height="5" rx="2.5" fill="var(--tblr-border-color)"/><rect x="10" y="51" width="30" height="5" rx="2.5" fill="var(--tblr-border-color)"/><text x="80" y="59" text-anchor="end" font-size="6" fill="var(--tblr-secondary)">${value}</text></svg>`

function renderSettingsMarkup(): string {
  const scheme = renderImageChoices('scheme', 'Esquema de cores', 'A página e a navegação em uma só escolha.', schemeOptions, (value) => `<span class="scheme-preview scheme-preview-${value}" aria-hidden="true"><i></i><i></i><i></i><i class="scheme-lines"></i></span>`)
  const fonts = renderImageChoices('theme-font', 'Família tipográfica', 'A tipografia usada em toda a interface.', fontOptions, (value) => `<span class="font-preview font-preview-${value}" aria-hidden="true">Aa</span>`)
  const bases = renderImageChoices('theme-base', 'Paleta neutra', 'A paleta cinza usada nos planos de fundo.', baseOptions, (value) => `<svg class="setting-preview-image" viewBox="0 0 96 64" data-bs-theme-base="${value}" aria-hidden="true"><rect x=".5" y=".5" width="95" height="63" rx="6" fill="var(--tblr-bg-surface)" stroke="var(--tblr-border-color)"/>${[100, 300, 500, 700, 900].map((shade, index) => `<rect x="${10 + index * 16}" y="24" width="12" height="16" rx="3" fill="var(--tblr-gray-${shade})"/>`).join('')}</svg>`)
  const radius = renderImageChoices('theme-radius', 'Arredondamento dos cantos', 'Ajuste o formato dos componentes.', radiusOptions, (value) => `<svg class="setting-preview-image" viewBox="0 0 96 64" aria-hidden="true"><rect x=".5" y=".5" width="95" height="63" rx="6" fill="var(--tblr-bg-surface-secondary)" stroke="var(--tblr-border-color)"/><rect x="28" y="12" width="40" height="40" rx="${Number(value) * 10}" fill="var(--tblr-primary)"/></svg>`)
  const navigationPreview = (mode: string) => `<svg class="setting-preview-image" viewBox="0 0 96 64" aria-hidden="true"><rect x=".5" y=".5" width="95" height="63" rx="6" fill="var(--tblr-bg-surface-secondary)" stroke="var(--tblr-border-color)"/>${mode !== 'vertical' ? '<rect x="1" y="1" width="94" height="14" rx="5" fill="var(--tblr-primary)"/><rect x="8" y="6" width="13" height="4" rx="2" fill="rgba(255,255,255,.8)"/><rect x="27" y="6" width="13" height="4" rx="2" fill="rgba(255,255,255,.65)"/>' : ''}${mode !== 'horizontal' ? `<rect x="1" y="${mode === 'hybrid' ? '15' : '1'}" width="24" height="${mode === 'hybrid' ? '48' : '62'}" rx="${mode === 'hybrid' ? '0' : '5'}" fill="var(--tblr-primary)"/><rect x="6" y="${mode === 'hybrid' ? '23' : '10'}" width="14" height="4" rx="2" fill="rgba(255,255,255,.8)"/><rect x="6" y="${mode === 'hybrid' ? '33' : '20'}" width="14" height="4" rx="2" fill="rgba(255,255,255,.65)"/><rect x="6" y="${mode === 'hybrid' ? '43' : '30'}" width="14" height="4" rx="2" fill="rgba(255,255,255,.65)"/>` : ''}<rect x="${mode === 'vertical' ? '34' : mode === 'hybrid' ? '34' : '9'}" y="${mode === 'vertical' ? '12' : mode === 'hybrid' ? '23' : '25'}" width="${mode === 'horizontal' ? '70' : '54'}" height="5" rx="2.5" fill="var(--tblr-border-color)"/><rect x="${mode === 'vertical' ? '34' : mode === 'hybrid' ? '34' : '9'}" y="${mode === 'vertical' ? '23' : mode === 'hybrid' ? '34' : '36'}" width="${mode === 'horizontal' ? '48' : '42'}" height="5" rx="2.5" fill="var(--tblr-border-color)"/></svg>`
  const layouts = renderImageChoices('navbar-position', 'Navegação', 'Escolha a composição do menu principal.', [{ value: 'horizontal', label: 'Navbar' }, { value: 'vertical', label: 'Sidebar' }, { value: 'hybrid', label: 'Navbar + sidebar' }], navigationPreview)
  const widths = renderImageChoices('layout', 'Largura do conteúdo', 'Defina a largura da área de conteúdo.', [{ value: 'default', label: 'Padrão' }, { value: 'fluid', label: 'Fluido' }, { value: 'boxed', label: 'Em caixa' }], (value) => svgPreview(value))

  const simpleChoice = (name: string, title: string, hint: string, options: SettingOption[]) => renderImageChoices(name, title, hint, options, (value) => svgPreview(value), options.length === 2 ? 2 : 3)

  return `<div class="settings">
    <button type="button" class="btn btn-floating btn-icon btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-settings" aria-controls="offcanvas-settings" aria-label="Personalizar">✎</button>
    <form class="offcanvas offcanvas-end offcanvas-floating" tabindex="-1" id="offcanvas-settings" aria-modal="true" role="dialog" aria-labelledby="offcanvas-settings-title">
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3 z-1" data-bs-dismiss="offcanvas" aria-label="Fechar configurações"></button>
      <div class="offcanvas-body p-0">
        <section class="settings-intro p-4 text-center border-bottom"><img class="settings-illustration mb-3" src="/tabler/static/illustrations/light/computer-fix.png" alt=""/><h2 class="offcanvas-title mb-1" id="offcanvas-settings-title">Personalize o Tabler</h2><p class="text-secondary m-0">Escolha o visual e o layout. Suas preferências são salvas neste navegador.</p></section>
        <section class="p-4 border-bottom"><h3 class="subheader mb-3">Aparência</h3><div class="settings-groups">
          ${scheme}${renderColorChoices()}${fonts}${bases}${radius}
        </div></section>
        <section class="p-4"><h3 class="subheader mb-3">Layout</h3><div class="settings-groups">
          ${layouts}${widths}
          ${simpleChoice('navbar', 'Comportamento da navegação', 'Mantenha a barra visível ao rolar a página.', [{ value: 'default', label: 'Padrão' }, { value: 'sticky', label: 'Fixa' }])}
          ${simpleChoice('navbar-style', 'Estilo da navegação', 'Acople a navegação ou deixe-a flutuante.', [{ value: 'default', label: 'Acoplada' }, { value: 'floating', label: 'Flutuante' }])}
          ${simpleChoice('navbar-theme', 'Tema da navegação', 'Escolha o esquema visual da barra.', [{ value: 'default', label: 'Padrão' }, { value: 'dark', label: 'Escuro' }, { value: 'primary', label: 'Colorido' }])}
          ${simpleChoice('offcanvas-style', 'Painéis laterais', 'Acople os painéis ou use o estilo flutuante.', [{ value: 'default', label: 'Acoplado' }, { value: 'floating', label: 'Flutuante' }])}
          ${simpleChoice('sidebar', 'Barra lateral', 'Escolha como a barra lateral se comporta.', [{ value: 'default', label: 'Expandida' }, { value: 'folded', label: 'Recolhida' }, { value: 'folded-hover', label: 'Ao passar o mouse' }])}
        </div></section>
      </div>
      <div class="offcanvas-footer border-top space-y-2"><button type="button" class="btn w-100" id="reset-theme-settings">↻ &nbsp; Restaurar configurações</button><button type="button" class="btn btn-primary w-100" data-bs-dismiss="offcanvas">Salvar alterações</button></div>
    </form>
  </div>`
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="page">
    <header class="navbar navbar-expand-md d-print-none app-header">
      <div class="container-xl">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Abrir menu"><span class="navbar-toggler-icon"></span></button>
        <h1 class="navbar-brand navbar-brand-autodark pe-0 pe-md-3"><a class="text-decoration-none" href="/">Minha aplicação</a></h1>
        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item header-settings-action"><button type="button" class="nav-link px-2 border-0 bg-transparent" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-settings" aria-controls="offcanvas-settings" aria-label="Abrir configurações"><span class="nav-link-icon d-md-none d-lg-inline-block" aria-hidden="true">⚙</span><span class="d-none d-md-inline">Configurações</span></button></div>
          <div class="nav-item dropdown"><a class="nav-link px-2" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false" aria-label="Abrir menu do usuário"><span class="avatar avatar-sm bg-primary-lt">A</span><span class="d-none d-lg-inline ms-2">Administrador</span></a><div class="dropdown-menu dropdown-menu-end"><span class="dropdown-header">Administrador</span><a class="dropdown-item" href="#usuario">Minha conta</a><a class="dropdown-item" href="#configuracoes">Preferências</a></div></div>
        </div>
        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center"><ul class="navbar-nav">
            <li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false"><span class="nav-link-title">Prestação de Contas</span></a><div class="dropdown-menu"><a class="dropdown-item" href="#termo-fomento">Termo Fomento</a><a class="dropdown-item" href="#termo-colaboracao">Termo de Colaboração</a><a class="dropdown-item" href="#acordo-cooperacao">Acordo de Cooperação</a></div></li>
            <li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false"><span class="nav-link-title">Organização</span></a><div class="dropdown-menu"><a class="dropdown-item" href="#dados-instituicao">Dados da Instituição</a><a class="dropdown-item" href="#usuario">Usuário</a><a class="dropdown-item" href="#permissao">Permissão</a></div></li>
          </ul></div>
        </div>
      </div>
    </header>
    <aside class="navbar navbar-vertical navbar-expand-lg app-sidebar" id="app-sidebar" aria-label="Navegação lateral">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu" aria-controls="sidebar-menu" aria-expanded="true" aria-label="Alternar menu lateral"><span class="navbar-toggler-icon"></span></button>
        <div class="navbar-brand navbar-brand-autodark"><a href="/" aria-label="Minha aplicação"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68" width="32" height="32" aria-hidden="true" class="navbar-brand-image"><path d="M64.6 16.2C63 9.9 58.1 5 51.8 3.4 40 1.5 28 1.5 16.2 3.4 9.9 5 5 9.9 3.4 16.2 1.5 28 1.5 40 3.4 51.8 5 58.1 9.9 63 16.2 64.6c11.8 1.9 23.8 1.9 35.6 0C58.1 63 63 58.1 64.6 51.8c1.9-11.8 1.9-23.8 0-35.6zM33.3 36.3c-2.8 4.4-6.6 8.2-11.1 11-1.5.9-3.3.9-4.8.1s-2.4-2.3-2.5-4c0-1.7.9-3.3 2.4-4.1 2.3-1.4 4.4-3.2 6.1-5.3-1.8-2.1-3.8-3.8-6.1-5.3-2.3-1.3-3-4.2-1.7-6.4s4.3-2.9 6.5-1.6c4.5 2.8 8.2 6.5 11.1 10.9 1 1.4 1 3.3.1 4.7zM49.2 46H37.8c-2.1 0-3.8-1-3.8-3s1.7-3 3.8-3h11.4c2.1 0 3.8 1 3.8 3s-1.7 3-3.8 3z" fill="currentColor" style="fill: var(--tblr-navbar-logo-color, var(--tblr-primary, #066fd1))"/></svg></a></div>
        <nav class="collapse navbar-collapse app-sidebar-menu show" id="sidebar-menu" aria-label="Menu principal">
        <ul class="navbar-nav pt-lg-3">
          <li class="nav-section-title">Prestação de Contas</li>
          <li class="nav-item dropdown active">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-haspopup="true" aria-expanded="true">
              <span class="nav-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></span><span class="nav-link-title">Prestação de Contas</span>
            </a>
            <div class="dropdown-menu show">
              <a class="dropdown-item" href="#termo-fomento"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>Termo Fomento</a>
              <a class="dropdown-item" href="#termo-colaboracao"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>Termo de Colaboração</a>
              <a class="dropdown-item" href="#acordo-cooperacao"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="m8 12 2.5 2.5L16 9"/></svg>Acordo de Cooperação</a>
            </div>
          </li>
          <li class="nav-section-title mt-3">Organização</li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-haspopup="true" aria-expanded="false">
              <span class="nav-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg></span><span class="nav-link-title">Organização</span>
            </a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#dados-instituicao"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>Dados da Instituição</a>
              <a class="dropdown-item" href="#usuario"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>Usuário</a>
              <a class="dropdown-item" href="#permissao"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon dropdown-item-icon" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 1 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0-1.4-3.4h-.3a2 2 0 1 1 0-4h.2a2 2 0 0 0 1.4-3.4l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 3.4-1.4v-.3a2 2 0 1 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0 1.4 3.4h.3a2 2 0 1 1 0 4h-.2a2 2 0 0 0-1.4 3.4z"/></svg>Permissão</a>
            </div>
          </li>
          <li class="nav-item sidebar-customize"><button type="button" class="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-settings" aria-controls="offcanvas-settings"><span class="nav-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" aria-hidden="true"><path d="M3 21v-4a4 4 0 1 1 4 4H3"/><path d="M21 3a16 16 0 0 0-12.8 10.2"/><path d="M21 3a16 16 0 0 1-10.2 12.8"/><path d="M10.6 9a9 9 0 0 1 4.4 4.4"/></svg></span><span class="nav-link-title">Personalizar</span></button></li>
        </ul>
        </nav>
        <div class="navbar-footer app-sidebar-footer"><ul class="navbar-nav"><li class="nav-item dropup"><a href="#" class="nav-link" data-bs-toggle="dropdown" aria-label="Abrir menu do usuário"><span class="avatar avatar-sm bg-primary-lt">A</span><div class="nav-link-title">Administrador<div class="small text-secondary">Minha conta</div></div></a><div class="dropdown-menu"><a class="dropdown-item" href="#usuario">Perfil</a><a class="dropdown-item" href="#configuracoes">Configurações</a></div></li></ul></div>
      </div>
    </aside>
    <div class="page-wrapper">
      <div class="page-header d-print-none"><div class="container-xl"><div class="row g-2 align-items-center"><div class="col"><div class="page-pretitle">Início</div><h2 class="page-title">Visão geral</h2></div><div class="col-auto ms-auto d-print-none"><button id="refresh-button" class="btn btn-primary"><span class="me-2" aria-hidden="true">↻</span>Atualizar painel</button></div></div></div></div>
      <div class="page-body"><div class="container-xl">
        <div class="row row-deck row-cards">
          <div class="col-12"><div class="card welcome-card"><div class="card-body"><div class="row align-items-center"><div class="col"><div class="text-secondary mb-2">ESTRUTURA PRONTA PARA COMEÇAR</div><h3 class="welcome-title">Seu próximo projeto começa aqui.</h3><div class="text-secondary">Base Vite + TypeScript com os estilos e componentes Tabler disponíveis.</div></div><div class="col-auto d-none d-md-block"><div class="welcome-mark" aria-hidden="true">T</div></div></div></div></div></div>
          <div class="col-sm-6 col-lg-4"><div class="card"><div class="card-body"><div class="subheader">Projetos</div><div class="d-flex align-items-baseline"><div class="h1 mb-0 me-2">12</div><div class="text-success">+2 este mês</div></div><div class="progress progress-sm mt-3"><div class="progress-bar bg-primary" style="width: 65%" role="progressbar" aria-label="Progresso de projetos" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"></div></div></div></div></div>
          <div class="col-sm-6 col-lg-4"><div class="card"><div class="card-body"><div class="subheader">Tarefas concluídas</div><div class="d-flex align-items-baseline"><div class="h1 mb-0 me-2">84%</div><div class="text-success">+8%</div></div><div class="text-secondary mt-3">Bom trabalho — o progresso está no caminho certo.</div></div></div></div>
          <div class="col-sm-6 col-lg-4"><div class="card"><div class="card-body"><div class="subheader">Status do ambiente</div><div class="d-flex align-items-center mt-2"><span class="status-dot status-dot-animated status-green me-2"></span><span class="fw-medium">Pronto para desenvolvimento</span></div><div class="text-secondary mt-3">Vite com recarga rápida ativada.</div></div></div></div>
          <div class="col-12"><div class="card" id="relatorios"><div class="card-header"><h3 class="card-title">Comece a desenvolver</h3></div><div class="card-body"><p class="text-secondary mb-3">Edite a tela inicial em <span class="font-monospace">src/main.ts</span> e personalize o visual em <span class="font-monospace">src/app.css</span>. Os exemplos HTML originais continuam disponíveis na pasta <span class="font-monospace">../base</span>.</p><div class="d-flex flex-wrap gap-2"><span class="badge bg-blue-lt">Tabler UI</span><span class="badge bg-purple-lt">TypeScript</span><span class="badge bg-green-lt">Vite</span></div></div></div></div>
        </div>
      </div></div>
      <footer class="footer footer-transparent d-print-none"><div class="container-xl"><div class="text-center text-secondary">Projeto inicial · Vite + Tabler</div></div></footer>
    </div>
  </div>
  ${renderSettingsMarkup()}
`

const refreshButton = document.querySelector<HTMLButtonElement>('#refresh-button')
refreshButton?.addEventListener('click', () => {
  refreshButton.disabled = true
  refreshButton.textContent = 'Painel atualizado'
  window.setTimeout(() => {
    refreshButton.disabled = false
    refreshButton.innerHTML = '<span class="me-2" aria-hidden="true">↻</span>Atualizar painel'
  }, 1200)
})

const themeDefaults: Record<string, string> = {
  theme: 'auto',
  'theme-base': 'neutral',
  'theme-font': 'sans-serif',
  'theme-primary': 'blue',
  'theme-radius': '1',
  layout: 'default',
  navbar: 'default',
  'navbar-position': 'horizontal',
  'navbar-style': 'default',
  'navbar-theme': 'default',
  'offcanvas-style': 'default',
  sidebar: 'default',
}

const themePresets: Record<string, Record<string, string>> = {
  auto: { theme: 'auto', 'navbar-theme': 'default' },
  light: { theme: 'light', 'navbar-theme': 'default' },
  dark: { theme: 'dark', 'navbar-theme': 'default' },
  'dark-nav': { theme: 'light', 'navbar-theme': 'dark' },
  colored: { theme: 'light', 'navbar-theme': 'primary' },
}

const settingsForm = document.querySelector<HTMLFormElement>('#offcanvas-settings')!
const settingsUrl = new URL(window.location.href)

function currentSetting(key: string): string {
  return localStorage.getItem(`tabler-${key}`) ??
    (key === 'theme' ? null : document.documentElement.getAttribute(`data-bs-${key}`)) ??
    themeDefaults[key]
}

function applySetting(key: string, value: string): void {
  const resolvedValue = key === 'theme' && value === 'auto'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : value

  if (resolvedValue === themeDefaults[key]) {
    document.documentElement.removeAttribute(`data-bs-${key}`)
  } else {
    document.documentElement.setAttribute(`data-bs-${key}`, resolvedValue)
  }

  localStorage.setItem(`tabler-${key}`, value)
  if (value === themeDefaults[key]) settingsUrl.searchParams.delete(key)
  else settingsUrl.searchParams.set(key, value)
}

function updateSettingsForm(): void {
  Object.keys(themeDefaults).forEach((key) => {
    settingsForm.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`).forEach((control) => {
      control.checked = control.value === currentSetting(key)
    })
  })

  const activeScheme = Object.entries(themePresets).find(([, values]) =>
    Object.entries(values).every(([key, value]) => currentSetting(key) === value),
  )?.[0] ?? 'auto'
  settingsForm.querySelectorAll<HTMLInputElement>('input[name="scheme"]').forEach((control) => {
    control.checked = control.value === activeScheme
  })

  const navigationMode = currentSetting('navbar-position')
  const hasSidebar = navigationMode === 'vertical' || navigationMode === 'hybrid'
  const hasNavbar = navigationMode === 'horizontal' || navigationMode === 'hybrid'
  settingsForm.querySelector<HTMLElement>('[data-theme-setting="sidebar"]')!.hidden = !hasSidebar
  settingsForm.querySelectorAll<HTMLElement>('[data-theme-setting="navbar"], [data-theme-setting="navbar-style"], [data-theme-setting="navbar-theme"]').forEach((group) => {
    group.hidden = !hasNavbar
  })

  const page = document.querySelector<HTMLElement>('#app > .page')!
  page.dataset.navigationMode = navigationMode
  page.dataset.sidebarMode = currentSetting('sidebar')
  const sidebar = document.querySelector<HTMLElement>('#app-sidebar')!
  sidebar.hidden = !hasSidebar
  sidebar.dataset.sidebarMode = currentSetting('sidebar')

  const header = document.querySelector<HTMLElement>('.app-header')!
  header.hidden = navigationMode === 'vertical'
  header.dataset.navigationMode = navigationMode
  header.classList.toggle('sticky-top', currentSetting('navbar') === 'sticky')
  header.classList.toggle('navbar-floating', currentSetting('navbar-style') === 'floating')
  header.classList.toggle('navbar-dark', currentSetting('navbar-theme') === 'dark')
  header.classList.toggle('bg-primary', currentSetting('navbar-theme') === 'primary')
}

settingsForm.addEventListener('change', (event) => {
  const control = event.target
  if (!(control instanceof HTMLInputElement) || control.type !== 'radio') return

  if (control.name === 'scheme') {
    const preset = themePresets[control.value]
    Object.entries(preset).forEach(([key, value]) => applySetting(key, value))
  } else if (control.name in themeDefaults) {
    applySetting(control.name, control.value)
  }

  updateSettingsForm()
  window.history.replaceState({}, '', settingsUrl)
  window.dispatchEvent(new Event('resize'))
})

document.querySelector<HTMLButtonElement>('#reset-theme-settings')?.addEventListener('click', () => {
  Object.entries(themeDefaults).forEach(([key, value]) => {
    localStorage.removeItem(`tabler-${key}`)
    settingsUrl.searchParams.delete(key)
    const resolvedValue = key === 'theme' && value === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : value
    if (resolvedValue === themeDefaults[key]) document.documentElement.removeAttribute(`data-bs-${key}`)
    else document.documentElement.setAttribute(`data-bs-${key}`, resolvedValue)
  })

  updateSettingsForm()
  window.history.replaceState({}, '', settingsUrl)
  window.dispatchEvent(new Event('resize'))
})

updateSettingsForm()
