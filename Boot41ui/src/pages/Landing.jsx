import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Employee Management',
    description: 'Easily manage your workforce with comprehensive employee profiles and role management.',
    icon: UserGroupIcon,
  },
  {
    name: 'Assignment Tracking',
    description: 'Track and manage assignments with real-time status updates and deadline monitoring.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Performance Analytics',
    description: 'Get insights into employee performance with detailed analytics and reports.',
    icon: ChartBarIcon,
  },
  {
    name: 'Scheduling',
    description: 'Efficiently schedule assignments and track deadlines with our calendar integration.',
    icon: CalendarIcon,
  },
  {
    name: 'Real-time Updates',
    description: 'Stay up-to-date with real-time notifications and status changes.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Cloud Storage',
    description: 'Securely store and access all your employee and assignment data in the cloud.',
    icon: CloudArrowUpIcon,
  },
]

const testimonials = [
  {
    content: "This system has transformed how we manage our employees and assignments. It's intuitive and powerful.",
    author: "Sarah Johnson",
    role: "HR Director",
    company: "Tech Solutions Inc.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "The real-time tracking and analytics have helped us improve our team's productivity significantly.",
    author: "Michael Chen",
    role: "Project Manager",
    company: "Innovation Labs",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "A game-changer for our organization. The interface is beautiful and the features are exactly what we needed.",
    author: "Emily Rodriguez",
    role: "Operations Manager",
    company: "Global Enterprises",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "The employee management features have streamlined our HR processes and saved us countless hours.",
    author: "David Park",
    role: "CTO",
    company: "Future Tech",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
]

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#FFF8F0] font-['Roboto',sans-serif]">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80')] bg-cover bg-fixed bg-center"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-[#FFA500]/10 px-3 py-1 text-sm font-semibold leading-6 text-[#FFA500] ring-1 ring-inset ring-[#FFA500]/20">
                  Latest updates
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium text-gray-100">
                  <span>Just shipped v1.0</span>
                  <ChevronRightIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="text-[#FFA500]">Think41</span> Employee Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Streamline your workforce management with our comprehensive solution. Track assignments, monitor performance, and boost productivity with our intuitive platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/employees"
                className="rounded-md bg-[#28a745] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#218838] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28a745] transition-colors"
              >
                Get started
              </Link>
              <Link to="/assignments" className="text-sm font-semibold leading-6 text-white hover:text-[#FFA500] transition-colors">
                View assignments <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#FFA500]">Faster Management</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your team
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools you need to efficiently manage your employees, track assignments, and monitor performance.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="group relative flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-100 to-green-100">
                  <feature.icon className="h-8 w-8 flex-none text-blue-600" aria-hidden="true" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Testimonial section */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-[#FFA500]">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by companies worldwide
            </p>
          </div>
          <div className="relative mt-10">
            <div className="relative mx-auto max-w-2xl">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-10">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-700 ${
                      index === currentTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0'
                    }`}
                  >
                    <figure className="text-center">
                      <div className="relative mx-auto h-24 w-24 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-spin-slow"></div>
                        <img
                          className="relative h-24 w-24 rounded-full border-2 border-white object-cover"
                          src={testimonial.image}
                          alt={testimonial.author}
                        />
                      </div>
                      <blockquote className="text-xl italic font-light leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                        <p>"{testimonial.content}"</p>
                      </blockquote>
                      <figcaption className="mt-8">
                        <div className="mt-4">
                          <div className="font-semibold text-gray-900">{testimonial.author}</div>
                          <div className="text-gray-600">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-[#FFA500] w-4' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your workplace?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Join thousands of companies already using Think41 to manage their teams more effectively.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <Link
                  to="/employees"
                  className="flex-none rounded-md bg-[#28a745] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#218838] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28a745] transition-colors"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-white">Team Management</dt>
                <dd className="mt-2 leading-7 text-gray-400">
                  Manage your entire workforce from a single dashboard
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                  <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-white">Performance Tracking</dt>
                <dd className="mt-2 leading-7 text-gray-400">
                  Monitor and improve team performance with real-time analytics
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <footer className="bg-[#1a237e]" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-[#FFA500]">Think41</h3>
              <p className="text-sm leading-6 text-gray-300">
                Making employee management efficient and enjoyable.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#FFA500]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FFA500]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FFA500]">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Features</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link to="/employees" className="text-sm leading-6 text-gray-300 hover:text-[#FFA500]">
                        Employees
                      </Link>
                    </li>
                    <li>
                      <Link to="/assignments" className="text-sm leading-6 text-gray-300 hover:text-[#FFA500]">
                        Assignments
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-[#FFA500]">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-[#FFA500]">
                        API Status
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 Think41. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
