import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Particles from './components/Particles';
import StrokeText from './components/StrokeText';
import SpecularButton from './components/SpecularButton';
import './styles.css';

const routeTitles = {
  '/': '让专注发生',
  '/login': '欢迎回来',
  '/register': '拥有你的学习空间',
  '/forgot-password': '找回密码'
};

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  function navigate(to) {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }
  return [path, navigate];
}

function RouteLink({ to, navigate, children, className, ...props }) {
  return <a href={to} className={className} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }} {...props}>{children}</a>;
}

function AuthForm({ mode, navigate }) {
  const isRegister = mode === '/register';
  const isRecovery = mode === '/forgot-password';
  const [values, setValues] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const formRef = useRef(null);

  function update(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
    setNotice('');
  }

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = '请输入有效的邮箱地址';
    if (!isRecovery && !values.password) next.password = '请输入密码';
    if (isRegister && values.password.length < 8) next.password = '密码至少需要 8 个字符';
    if (isRegister && values.confirm !== values.password) next.confirm = '两次输入的密码不一致';
    if (isRegister && !values.confirm) next.confirm = '请再次输入密码';
    setErrors(next);
    setNotice('');
    if (Object.keys(next).length) {
      formRef.current?.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    // Page preview only: never send or persist account credentials until auth is connected.
    setNotice(isRecovery
      ? '密码找回服务尚未开放，本次未发送邮件。'
      : '账号服务尚未开放，本次填写的信息不会提交或保存。');
    setValues(current => ({ ...current, password: '', confirm: '' }));
  }

  return <section className="auth-content" aria-labelledby="auth-title">
    <p className="eyebrow">{isRegister ? 'A PLACE OF YOUR OWN' : isRecovery ? 'FIND YOUR WAY BACK' : 'YOUR SPACE, YOUR PACE'}</p>
    <h1 id="auth-title">{routeTitles[mode]}</h1>
    <p className="auth-description">{isRegister ? '从今天开始，给认真学习的自己留一个位置。' : isRecovery ? '输入注册邮箱，找回通往书房的钥匙。' : '回到你的书房，接着上一次的思考。'}</p>
    <form onSubmit={submit} noValidate ref={formRef}>
      <div className="field">
        <label htmlFor="email">邮箱</label>
        <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={update} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
      </div>
      {!isRecovery && <div className="field">
        <div className="label-row"><label htmlFor="password">密码</label>
          {!isRegister && <RouteLink to="/forgot-password" navigate={navigate}>忘记密码？</RouteLink>}
        </div>
        <div className="password-field">
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={values.password} onChange={update} placeholder={isRegister ? '至少 8 个字符' : '输入你的密码'} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-pressed={showPassword} aria-label={showPassword ? '隐藏密码' : '显示密码'}>{showPassword ? '隐藏' : '显示'}</button>
        </div>
        {errors.password && <p id="password-error" className="field-error">{errors.password}</p>}
      </div>}
      {isRegister && <div className="field">
        <label htmlFor="confirm">确认密码</label>
        <input id="confirm" name="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirm} onChange={update} placeholder="再次输入密码" aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? 'confirm-error' : undefined} />
        {errors.confirm && <p id="confirm-error" className="field-error">{errors.confirm}</p>}
      </div>}
      <p className="service-note">账号服务准备中，当前仅可预览页面与填写校验。</p>
      <SpecularButton type="submit" size="md" radius={6} className="form-submit" textColor="#f4f3f0">{isRecovery ? '发送重置邮件' : isRegister ? '创建账号' : '登录'}</SpecularButton>
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </form>
    <p className="switch-auth">{isRecovery ? '想起密码了？' : isRegister ? '已经有账号？' : '还没有账号？'} <RouteLink to={isRegister || isRecovery ? '/login' : '/register'} navigate={navigate}>{isRegister || isRecovery ? '去登录' : '创建账号'}</RouteLink></p>
  </section>;
}

function App() {
  const [path, navigate] = useRoute();
  const [paused, setPaused] = useState(false);
  const routeRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const isKnown = Object.hasOwn(routeTitles, path);
  const isAuth = isKnown && path !== '/';

  useEffect(() => {
    const title = titleRef.current;
    const eyebrow = eyebrowRef.current;
    if (!title || !eyebrow) return undefined;
    const align = () => {
      title.style.transform = 'none';
      let pipeCenter = null;
      for (const tspan of title.querySelectorAll('tspan')) {
        if (tspan.textContent === '|') {
          const r = tspan.getBoundingClientRect();
          pipeCenter = r.left + r.width / 2;
          break;
        }
      }
      const text = eyebrow.textContent || '';
      const idx = text.indexOf('——');
      if (pipeCenter == null || idx < 0 || !eyebrow.firstChild) return;
      const range = document.createRange();
      range.setStart(eyebrow.firstChild, idx);
      range.setEnd(eyebrow.firstChild, idx + 2);
      const dash = range.getBoundingClientRect();
      if (!dash.width) return;
      title.style.transform = `translateX(${(dash.left + dash.width / 2) - pipeCenter}px)`;
    };
    align();
    document.fonts?.ready?.then(align).catch(() => {});
    window.addEventListener('resize', align);
    const layoutObserver = new ResizeObserver(align);
    layoutObserver.observe(title);
    if (eyebrow) layoutObserver.observe(eyebrow);
    return () => {
      layoutObserver.disconnect();
      window.removeEventListener('resize', align);
    };
  });

  useEffect(() => {
    document.title = `${routeTitles[path] ?? '页面未找到'} · Stud1sm OUTbreak`;
    if (path !== '/') routeRef.current?.focus();
  }, [path]);

  return <div className={`app-shell ${isAuth ? 'is-auth' : ''}`}>
    <div className="particle-layer">
      <Particles particleColors={['#ffffff']} particleCount={200} particleSpread={10} speed={0.1} particleBaseSize={100} glow={0.5} twinkle={0.3} moveParticlesOnHover hoverEffect="parallax" paused={paused} />
    </div>
    <div className="scene-shade" aria-hidden="true" />
    <header className="site-header">
      <RouteLink className="wordmark" to="/" navigate={navigate} aria-label="Stud1sm OUTbreak 欢迎页"><span className="brand-symbol" aria-hidden="true">s.</span><span>Stud1sm<span className="wordmark-divider"> / </span>OUTbreak</span></RouteLink>
    </header>
    {isAuth && <div className="back-bar"><RouteLink className="back-link" to="/" navigate={navigate}><span aria-hidden="true">←</span> 返回</RouteLink></div>}
    <main ref={routeRef} tabIndex={-1} className={isAuth ? 'auth-main' : 'welcome-main'}>
      {path === '/' ? <section className="welcome-content" aria-labelledby="welcome-title">
        <p className="eyebrow" ref={eyebrowRef}>S属性大爆发——STUDY!!</p>
        <h1 id="welcome-title" className="welcome-stroke-title" ref={titleRef}>
          <StrokeText text="Stud1sm | OUTbreak" strokeColor="#efede8" fillColor="#f4f3f0" fontSize={112} fontWeight={600} letterSpacing={-4} strokeStyle="solid" strokeWidth={1.4} drawDuration={1.0} fillDelay={0.15} stagger={0.05} ease="power2.out" trigger="mount" fillMode="wipe" wipeFrom="left" hoverRedraw />
        </h1>
        <SpecularButton size="lg" radius={10} textColor="#f4f3f0" onClick={() => navigate('/login')}>LOG IN</SpecularButton>
      </section> : isAuth ? <AuthForm key={path} mode={path} navigate={navigate} /> : <section className="not-found"><h1>这条路还没铺好。</h1><SpecularButton size="lg" radius={10} textColor="#f4f3f0" onClick={() => navigate('/')}>回到欢迎页</SpecularButton></section>}
    </main>
    <footer className="site-footer"><span>属于你的学习空间</span><button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? '继续粒子动态' : '暂停粒子动态'}<span className="motion-indicator" aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
