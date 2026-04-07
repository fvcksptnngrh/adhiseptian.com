<template>
  <div class="guestbook-page">
    <div class="content-wrap">

      <!-- Page header -->
      <div class="page-header" data-aos="fade-up">
        <h1 class="page-header__title">Guestbook</h1>
        <p class="page-header__desc">
          Leave a message — say hi, share feedback, ask a question, or just drop some appreciation.
        </p>
      </div>

      <!-- All-in-one card: messages + form/login -->
      <div class="gb-card" data-aos="fade-up">

        <!-- Messages -->
        <div class="gb-messages">

          <!-- Loading -->
          <div v-if="loading" class="gb-loading">
            <div class="gb-skeleton" v-for="i in 4" :key="i"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="messages.length === 0" class="gb-empty">
            <p>No messages yet. Be the first to sign the guestbook!</p>
          </div>

          <!-- List -->
          <template v-else>
            <div
              v-for="(msg, index) in messages"
              :key="msg.id"
              class="gb-message"
            >
              <img
                v-if="msg.avatar_url"
                :src="msg.avatar_url"
                :alt="msg.name"
                class="gb-message__avatar-img"
                referrerpolicy="no-referrer"
              />
              <div v-else class="gb-message__avatar">{{ msg.name.charAt(0).toUpperCase() }}</div>
              <div class="gb-message__body">
                <div class="gb-message__top">
                  <span class="gb-message__name">{{ msg.name }}</span>
                  <span v-if="isAuthor(msg.user_id)" class="gb-badge">Author</span>
                  <span class="gb-message__date">{{ formatDate(msg.created_at) }}</span>
                </div>
                <p class="gb-message__text">{{ msg.message }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Divider -->
        <div class="gb-divider"></div>

        <!-- Logged in — form -->
        <div v-if="user" class="gb-compose">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="gb-compose__avatar"
            referrerpolicy="no-referrer"
          />
          <form @submit.prevent="submitMessage" class="gb-compose__form">
            <textarea
              v-model="form.message"
              placeholder="Write something..."
              maxlength="500"
              rows="2"
              class="gb-compose__input"
              :disabled="submitting"
            ></textarea>
            <div class="gb-compose__bottom">
              <span class="gb-compose__counter">{{ form.message.length }}/500</span>
              <div class="gb-compose__right">
                <button class="gb-compose__logout" type="button" @click="signOut">Sign out</button>
                <button
                  type="submit"
                  class="gb-compose__btn"
                  :disabled="submitting || !form.message.trim()"
                >
                  <span v-if="submitting" class="gb-compose__spinner"></span>
                  <span v-else>Post</span>
                </button>
              </div>
            </div>
            <transition name="fade">
              <span v-if="success" class="gb-compose__success">Message posted!</span>
            </transition>
            <transition name="fade">
              <span v-if="error" class="gb-compose__error">{{ error }}</span>
            </transition>
          </form>
        </div>

        <!-- Not logged in — sign in buttons -->
        <div v-else class="gb-auth">
          <span class="gb-auth__title">Sign in</span>
          <div class="gb-auth__buttons">
            <button class="gb-auth__btn gb-auth__btn--github" @click="signIn('github')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
            <button class="gb-auth__btn gb-auth__btn--google" @click="signIn('google')">
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>
          <p class="gb-auth__privacy">Rest assured, your data & privacy are safe with us.</p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import AOS from 'aos'

var AUTHOR_ID = '2227602c-eefd-46d7-b866-45b83511a220'

export default {
  name: 'GuestbookPage',
  data() {
    return {
      loading: true,
      submitting: false,
      success: false,
      error: null,
      user: null,
      messages: [],
      form: {
        message: ''
      }
    }
  },
  mounted() {
    var self = this
    this.fetchMessages()

    if (this.$supabase) {
      console.log('[guestbook] URL hash:', window.location.hash ? 'present' : 'none')
      console.log('[guestbook] Supabase client:', !!this.$supabase)

      this.$supabase.auth.onAuthStateChange(function (event, session) {
        console.log('[guestbook] Auth event:', event, 'Session:', !!session)
        if (session) {
          console.log('[guestbook] User:', session.user.email, session.user.user_metadata)
        }
        self.setUser(session)
        self.$nextTick(function () {
          if (typeof AOS !== 'undefined') AOS.refresh()
        })
      })

      this.checkAuth()
    } else {
      console.warn('[guestbook] $supabase not available!')
    }
  },
  methods: {
    setUser(session) {
      if (session && session.user) {
        var u = session.user
        var meta = u.user_metadata || {}
        this.user = {
          id: u.id,
          name: meta.full_name || meta.name || meta.user_name || meta.preferred_username || u.email,
          avatar: meta.avatar_url || meta.picture || '',
          email: u.email
        }
      } else {
        this.user = null
      }
    },

    async checkAuth() {
      if (!this.$supabase) return
      try {
        var result = await this.$supabase.auth.getSession()
        var session = result.data ? result.data.session : null
        this.setUser(session)
      } catch (e) {
        console.warn('[guestbook] Auth check failed:', e.message)
      }
    },

    async signIn(provider) {
      if (!this.$supabase) return
      try {
        await this.$supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: window.location.origin + '/guestbook'
          }
        })
      } catch (e) {
        this.error = 'Sign in failed — try again'
      }
    },

    async signOut() {
      if (!this.$supabase) return
      await this.$supabase.auth.signOut()
      this.user = null
    },

    async fetchMessages() {
      this.loading = true
      try {
        var res = await fetch('/api/guestbook')
        var data = await res.json()
        if (Array.isArray(data)) {
          this.messages = data
        }
      } catch (e) {
        this.error = 'Failed to load messages'
      } finally {
        this.loading = false
        this.$nextTick(function () { AOS.refresh() })
      }
    },

    async submitMessage() {
      if (this.submitting || !this.user) return
      this.submitting = true
      this.error = null
      this.success = false

      try {
        var result = await this.$supabase.auth.getSession()
        var session = result.data ? result.data.session : null
        if (!session) {
          this.error = 'Session expired — please sign in again'
          this.user = null
          this.submitting = false
          return
        }

        var insertResult = await this.$supabase
          .from('guestbook')
          .insert({
            user_id: this.user.id,
            name: this.user.name,
            avatar_url: this.user.avatar,
            message: this.form.message.trim()
          })
          .select()

        if (insertResult.error) {
          this.error = insertResult.error.message
        } else {
          this.success = true
          this.form.message = ''
          await this.fetchMessages()
          var self = this
          setTimeout(function () { self.success = false }, 3000)
        }
      } catch (e) {
        this.error = 'Something went wrong — try again'
      } finally {
        this.submitting = false
      }
    },

    isAuthor(userId) {
      return userId === AUTHOR_ID
    },

    formatDate(dateStr) {
      var date = new Date(dateStr)
      var now = new Date()
      var diff = Math.floor((now - date) / 1000)

      if (diff < 60) return 'just now'
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  },
  head() {
    return {
      title: 'Guestbook — Adhi Septian Nugroho'
    }
  }
}
</script>

<style lang="scss" scoped>
.guestbook-page {
  padding: 48px 0 0;
}

.content-wrap {
  max-width: $container-max;
  margin: 0 auto;
  padding: 0 $container-padding;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  padding: 32px 0 16px;

  &__title {
    font-family: $font-heading;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  &__desc {
    font-size: $fs-small;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 560px;
  }
}

// ── Card ──
.gb-card {
  background: var(--glassmorphism-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
}

// ── Messages ──
.gb-messages {
  display: flex;
  flex-direction: column;
}

.gb-loading {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gb-skeleton {
  height: 48px;
  border-radius: 10px;
  background: var(--bg-elevated);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.gb-empty {
  text-align: center;
  padding: 32px 16px;

  p {
    font-size: $fs-small;
    color: var(--text-muted);
  }
}

.gb-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-subtle);

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &__avatar-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent-cyan);
    flex-shrink: 0;
    text-transform: uppercase;
    margin-top: 1px;
  }

  &__body {
    min-width: 0;
    flex: 1;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__name {
    font-size: $fs-caption;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__date {
    font-size: 11px;
    color: var(--text-muted);
    font-family: $font-mono;
  }

  &__text {
    font-size: $fs-small;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-top: 2px;
    word-break: break-word;
  }
}

// ── Divider ──
.gb-divider {
  height: 1px;
  background: var(--border-color);
  margin: 14px 0;
}

// ── Compose (logged in) ──
.gb-compose {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    margin-top: 4px;
  }

  &__form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background: var(--bg-elevated);
    color: var(--text-primary);
    font-family: $font-body;
    font-size: $fs-small;
    outline: none;
    resize: none;
    min-height: 60px;
    transition: border-color 0.2s ease;

    &::placeholder { color: var(--text-muted); }
    &:focus { border-color: var(--accent-cyan); }
    &:disabled { opacity: 0.5; }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__counter {
    font-size: 10px;
    color: var(--text-muted);
    font-family: $font-mono;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__logout {
    font-size: $fs-caption;
    color: var(--text-muted);
    font-family: $font-body;
    transition: color 0.2s ease;

    &:hover { color: #ef4444; }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 18px;
    border-radius: 8px;
    background: var(--accent-cyan);
    color: var(--bg-primary);
    font-size: $fs-caption;
    font-weight: 600;
    font-family: $font-body;
    transition: all 0.2s ease;

    &:hover:not(:disabled) { filter: brightness(1.15); }
    &:disabled { opacity: 0.4; }
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  &__success {
    font-size: $fs-caption;
    color: #22c55e;
    font-weight: 500;
  }

  &__error {
    font-size: $fs-caption;
    color: #ef4444;
    font-weight: 500;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ── Auth (bottom, not logged in) ──
.gb-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 8px 0 4px;

  &__title {
    font-size: $fs-small;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__buttons {
    display: flex;
    gap: 8px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: $fs-caption;
    font-weight: 600;
    font-family: $font-body;
    transition: all 0.2s ease;
    border: 1px solid var(--border-color);
    background: var(--bg-elevated);
    color: var(--text-primary);

    &:hover {
      border-color: var(--text-muted);
    }
  }

  &__privacy {
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.4;
  }
}

// ── Author Badge ──
.gb-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  border-radius: 100px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #cabdff 20% transparent;
  flex-shrink: 0;
  line-height: 1.7;
}

// ── Transitions ──
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
