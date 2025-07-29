'use client';

import Link from 'next/link';
import { 
  UserGroupIcon,
  LightBulbIcon,
  GlobeAltIcon,
  HeartIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const features = [
    {
      icon: UserGroupIcon,
      title: '커뮤니티 중심',
      description: '개발자들이 서로의 경험과 지식을 공유하며 함께 성장하는 커뮤니티를 만들어갑니다.',
    },
    {
      icon: LightBulbIcon,
      title: '지식 공유',
      description: '최신 기술 트렌드부터 실무 경험까지 다양한 주제의 게시글을 통해 지식을 나눕니다.',
    },
    {
      icon: GlobeAltIcon,
      title: '글로벌 네트워크',
      description: '전 세계의 개발자들과 연결되어 더 넓은 시야와 경험을 얻을 수 있습니다.',
    },
    {
      icon: HeartIcon,
      title: '열정과 성장',
      description: '개발에 대한 열정을 가지고 지속적으로 학습하고 성장하는 문화를 지향합니다.',
    },
  ];

  const stats = [
    { label: '활성 사용자', value: '1,000+' },
    { label: '게시글', value: '5,000+' },
    { label: '카테고리', value: '50+' },
    { label: '댓글', value: '10,000+' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              블로그에 대해
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              최신 기술과 개발 경험을 공유하는 블로그입니다.
              함께 성장하는 개발자 커뮤니티를 만들어갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* 미션 섹션 */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              우리의 미션
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              개발자들이 서로의 경험과 지식을 공유하며 함께 성장할 수 있는 플랫폼을 제공합니다.
              최신 기술 트렌드부터 실무 경험까지 모든 것을 공유하여 더 나은 개발자 커뮤니티를 만들어갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              블로그의 특징
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              우리가 제공하는 핵심 가치들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-soft hover:shadow-glow transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              블로그 현황
            </h2>
            <p className="text-xl text-primary-100">
              지금까지의 성과를 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 팀 섹션 */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              개발 팀
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              블로그를 만들어가는 개발자들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                프론트엔드 개발자
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Next.js와 React를 사용하여 사용자 친화적인 인터페이스를 구현합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                백엔드 개발자
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                NestJS와 TypeScript를 사용하여 안정적이고 확장 가능한 API를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                DevOps 엔지니어
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                지속적인 배포와 모니터링을 통해 안정적인 서비스를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            회원가입하고 다양한 게시글을 작성하고 공유해보세요.
            함께 성장하는 개발자 커뮤니티에 참여하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 dark:text-primary-400 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              회원가입
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
            >
              게시글 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 