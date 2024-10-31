import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const resources = {
  en: {
    translation: {
      common: {
        login: "Login",
        register: "Register",
        logout: "Logout",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        loading: "Loading..."
      },
      nav: {
        dashboard: "Dashboard",
        contracts: "Contracts",
        organization: "Organization",
        settings: "Settings"
      },
      auth: {
        loginTitle: "Sign in to your account",
        registerTitle: "Create a new account",
        forgotPassword: "Forgot password?",
        rememberMe: "Remember me",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?"
      },
      landing: {
        hero: {
          title1: "Smart Contract Risk",
          title2: "Management System",
          description: "Make contract management simple and efficient, helping your business reduce risks and improve efficiency.",
          startButton: "Get Started",
          loginButton: "Sign In",
          imageAlt: "Contract Management"
        },
        features: {
          subtitle: "Features",
          title: "Smarter Contract Management",
          contractManagement: {
            title: "Smart Contract Management",
            description: "Automatically identify key terms and important dates to ensure you never miss anything important."
          },
          alerts: {
            title: "Smart Alert System",
            description: "Timely reminders for contract expiration, payments, and other key milestones."
          },
          riskAnalysis: {
            title: "Risk Analysis",
            description: "In-depth contract risk analysis and professional financial planning advice."
          },
          security: {
            title: "Security Guarantee",
            description: "Enterprise-level security protection ensures your contract data is safe."
          }
        }
      },
      contracts: {
        title: "Contract Management",
        upload: "Upload Contract",
        analysis: "Contract Analysis",
        noContracts: "No contracts yet",
        uploadFirst: "Upload your first contract",
        status: {
          active: "Active",
          completed: "Completed",
          terminated: "Terminated"
        },
        form: {
          title: "Contract Title",
          value: "Contract Value",
          startDate: "Start Date",
          endDate: "End Date",
          parties: "Parties",
          firstParty: "First Party",
          secondParty: "Second Party"
        }
      }
    }
  },
  ja: {
    translation: {
      common: {
        login: "ログイン",
        register: "登録",
        logout: "ログアウト",
        email: "メールアドレス",
        password: "パスワード",
        confirmPassword: "パスワード確認",
        submit: "送信",
        cancel: "キャンセル",
        save: "保存",
        delete: "削除",
        edit: "編集",
        search: "検索",
        loading: "読み込み中..."
      },
      nav: {
        dashboard: "ダッシュボード",
        contracts: "契約管理",
        organization: "組織管理",
        settings: "設定"
      },
      auth: {
        loginTitle: "アカウントにログイン",
        registerTitle: "新規アカウント作成",
        forgotPassword: "パスワードをお忘れですか？",
        rememberMe: "ログイン状態を保持",
        noAccount: "アカウントをお持ちでない方",
        hasAccount: "既にアカウントをお持ちの方"
      },
      landing: {
        hero: {
          title1: "スマート契約リスク",
          title2: "管理システム",
          description: "契約管理をシンプルかつ効率的にし、ビジネスのリスク低減と効率向上を支援します。",
          startButton: "はじめる",
          loginButton: "ログイン",
          imageAlt: "契約管理"
        },
        features: {
          subtitle: "機能",
          title: "よりスマートな契約管理",
          contractManagement: {
            title: "スマート契約管理",
            description: "重要な条項や期日を自動的に識別し、重要事項の見落としを防ぎます。"
          },
          alerts: {
            title: "スマートアラートシステム",
            description: "契約期限、支払い、その他の重要なマイルストーンを適時にお知らせします。"
          },
          riskAnalysis: {
            title: "リスク分析",
            description: "契約リスクの詳細な分析と専門的な財務計画のアドバイスを提供します。"
          },
          security: {
            title: "セキュリティ保証",
            description: "エンタープライズレベルのセキュリティ保護で契約データの安全を確保します。"
          }
        }
      },
      contracts: {
        title: "契約管理",
        upload: "契約書アップロード",
        analysis: "契約書分析",
        noContracts: "契約書がありません",
        uploadFirst: "最初の契約書をアップロード",
        status: {
          active: "進行中",
          completed: "完了",
          terminated: "終了"
        },
        form: {
          title: "契約書タイトル",
          value: "契約金額",
          startDate: "開始日",
          endDate: "終了日",
          parties: "契約当事者",
          firstParty: "甲方",
          secondParty: "乙方"
        }
      }
    }
  },
  ko: {
    translation: {
      common: {
        login: "로그인",
        register: "회원가입",
        logout: "로그아웃",
        email: "이메일",
        password: "비밀번호",
        confirmPassword: "비밀번호 확인",
        submit: "제출",
        cancel: "취소",
        save: "저장",
        delete: "삭제",
        edit: "편집",
        search: "검색",
        loading: "로딩 중..."
      },
      nav: {
        dashboard: "대시보드",
        contracts: "계약 관리",
        organization: "조직 관리",
        settings: "설정"
      },
      auth: {
        loginTitle: "계정에 로그인",
        registerTitle: "새 계정 만들기",
        forgotPassword: "비밀번호를 잊으셨나요?",
        rememberMe: "로그인 상태 유지",
        noAccount: "계정이 없으신가요?",
        hasAccount: "이미 계정이 있으신가요?"
      },
      landing: {
        hero: {
          title1: "스마트 계약 리스크",
          title2: "관리 시스템",
          description: "계약 관리를 단순하고 효율적으로 만들어 비즈니스의 리스크 감소와 효율성 향상을 돕습니다.",
          startButton: "시작하기",
          loginButton: "로그인",
          imageAlt: "계약 관리"
        },
        features: {
          subtitle: "기능",
          title: "더 스마트한 계약 관리",
          contractManagement: {
            title: "스마트 계약 관리",
            description: "주요 조항과 중요 날짜를 자동으로 식별하여 중요한 사항을 놓치지 않도록 합니다."
          },
          alerts: {
            title: "스마트 알림 시스템",
            description: "계약 만료, 지불, 기타 주요 이정표에 대한 적시 알림을 제공합니다."
          },
          riskAnalysis: {
            title: "리스크 분석",
            description: "계약 리스크에 대한 심층 분석과 전문적인 재무 계획 조언을 제공합니다."
          },
          security: {
            title: "보안 보장",
            description: "기업 수준의 보안 보호로 계약 데이터의 안전을 보장합니다."
          }
        }
      },
      contracts: {
        title: "계약 관리",
        upload: "계약서 업로드",
        analysis: "계약서 분석",
        noContracts: "계약서가 없습니다",
        uploadFirst: "첫 번째 계약서를 업로드하세요",
        status: {
          active: "진행 중",
          completed: "완료",
          terminated: "종료"
        },
        form: {
          title: "계약서 제목",
          value: "계약 금액",
          startDate: "시작일",
          endDate: "종료일",
          parties: "계약 당사자",
          firstParty: "갑",
          secondParty: "을"
        }
      }
    }
  },
  zh: {
    translation: {
      common: {
        login: "登录",
        register: "注册",
        logout: "退出",
        email: "邮箱",
        password: "密码",
        confirmPassword: "确认密码",
        submit: "提交",
        cancel: "取消",
        save: "保存",
        delete: "删除",
        edit: "编辑",
        search: "搜索",
        loading: "加载中..."
      },
      nav: {
        dashboard: "仪表盘",
        contracts: "合同管理",
        organization: "组织管理",
        settings: "系统设置"
      },
      auth: {
        loginTitle: "登录您的账户",
        registerTitle: "注册新账户",
        forgotPassword: "忘记密码？",
        rememberMe: "记住我",
        noAccount: "还没有账户？",
        hasAccount: "已有账户？"
      },
      landing: {
        hero: {
          title1: "智能合同风险",
          title2: "管理系统",
          description: "让合同管理变得简单高效，帮助您的企业降低风险，提升效率。",
          startButton: "立即开始",
          loginButton: "登录系统",
          imageAlt: "合同管理"
        },
        features: {
          subtitle: "功能特点",
          title: "更智能的合同管理方式",
          contractManagement: {
            title: "智能合同管理",
            description: "自动识别关键条款和重要日期，确保您不会错过任何重要事项。"
          },
          alerts: {
            title: "智能提醒系统",
            description: "及时提醒合同到期、付款和其他关键时间节点。"
          },
          riskAnalysis: {
            title: "风险分析",
            description: "深度分析合同风险，提供专业的财务规划建议。"
          },
          security: {
            title: "安全保障",
            description: "企业级安全保护，确保您的合同数据安全无虞。"
          }
        }
      },
      contracts: {
        title: "合同管理",
        upload: "上传合同",
        analysis: "合同分析",
        noContracts: "暂无合同",
        uploadFirst: "开始上传您的第一份合同吧",
        status: {
          active: "进行中",
          completed: "已完成",
          terminated: "已终止"
        },
        form: {
          title: "合同标题",
          value: "合同金额",
          startDate: "开始日期",
          endDate: "结束日期",
          parties: "签约方",
          firstParty: "甲方",
          secondParty: "乙方"
        }
      }
    }
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    supportedLngs: ['en', 'zh', 'ko', 'ja'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;