'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import BibleSearch from '@/components/BibleSearch'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  BookOpen, 
  ChevronDown,
} from 'lucide-react'
import Header from '@/components/Header'

// Custom hook for scroll-based animations
const useScrollAnimation = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])
  
  return { y, opacity }
}

// Fade in animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 }
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 }
}

// Hero Section
const BibleSearchSection = () => {
  const { y, opacity } = useScrollAnimation()

  return (
    <section id="bibleSearch" className="relative py-20 flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-to-br from-gray-50 via-cream-100 to-gold-100 dark:from-gray-900 dark:via-gray-900/10 dark:to-gray-800"
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 border border-amber-400/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-24 h-24 border border-amber-300/20 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center z-50">
        {/* Header Section */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="mb-12 max-w-4xl mx-auto"
        >
            <Image
              src="/afikomen.png"
              alt="The Afikomen Logo"
              width={250}
              height={200}
              className="mx-auto block"
              style={{ width: "auto", height: "auto" }}
              priority
            />
        </motion.div>

        {/* Bible Search Section */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
              <motion.p 
                {...fadeInUp}
                transition={{ delay: 0.2 }}
                className="lg:w-2/3 w-full mx-auto text-lg text-center text-orange-400 dark:text-orange-300 mb-8"
              >
                Your simplified bible resource to search and read Bible passages from the modern & simplified world english translation
              </motion.p>
          </div>
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <BibleSearch />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={() => {
            document.getElementById('what-is-afikomen')?.scrollIntoView({ 
              behavior: 'smooth' 
            })
          }}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </button>
      </motion.div>
    </section>
  )
}

// What is Afikomen Section
const WhatIsAfikomenSection = () => {
  return (
    <section id="what-is-afikomen" className="py-20 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-orange-400 dark:text-orange-400 mr-4" />
            <h2 className="text-3xl font-bold text-orange-400 dark:text-orange-400">What Is the Afikomen?</h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            {...fadeInLeft}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg font-light text-orange-700 dark:text-orange-300 leading-relaxed">
              The <span className="font-bold">Afikomen</span> is a broken piece of matzah used in the Jewish Passover Seder. 
              This sacred bread holds deep symbolic meaning that transcends its simple appearance.
            </p>
            <p className="text-lg font-light text-orange-700 dark:text-orange-300 leading-relaxed">
              The word &quot;Afikomen&quot; comes from the Greek <em>&quot;epikomion&quot;</em>, meaning &quot;dessert&quot; or &quot;after-meal portion.&quot; 
              Yet this humble piece of unleavened bread carries the weight of centuries of tradition and prophecy.
            </p>
            <div className="bg-amber-100 dark:bg-amber-200/20 p-6 rounded-lg border-l-4 border-amber-400">
              <p className="text-amber-800 dark:text-amber-200 italic">
                &quot;And you shall observe this thing as an ordinance for you and your sons forever.&quot;
                <br />
                <span className="text-sm">— Exodus 12:24</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeInRight}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Visual representation of three matzot */}
            <div className="space-y-4">
              <Image
                src="/bread.png"
                alt="The Afikomen Logo"
                width={300}
                height={200}
                className="mx-auto block"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Afikomen App Section
const AfikomenAppSection = () => {
  return (
    <section id="afikomen-app" className="py-20 bg-gradient-to-b from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-orange-400 dark:text-orange-400 mb-6">What is the Afikomen App?</h2>
          <p className="text-lg text-orange-700 dark:text-orange-300 max-w-3xl mx-auto">
            The Afikomen App is a tool that helps you understand God&apos;s word and how it is revealed through the Afikomen and its connection to the Bible.
          </p>
        </motion.div>

        <div>
          <motion.div
            {...fadeInLeft}
            viewport={{ once: true }}
            className="p-8 rounded-lg flex flex-col lg:flex-row gap-4 justify-center items-start"
          >
            <Image 
              src="/mobile-1.png"
              alt="Mobile 1"
              width={300}
              height={200}
              className="mx-auto block"
              style={{ width: "auto", height: "auto" }}
              priority
            />

            <motion.div
              className="flex flex-col gap- lg:w-1/2 w-full mt-8"
            >

              <motion.h2
                {...fadeInRight}
                viewport={{ once: true }}
                className="text-xl font-semibold text-orange-400 dark:text-orange-300 mb-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/50 text-white text-xl font-light flex-shrink-0">
                    1
                  </div>
                  <span className="ml-3 text-2xl font-semibold text-orange-500 dark:text-orange-400">
                    Create An Account
                  </span>
                </div>
              </motion.h2>

              <motion.p
                {...fadeInRight}
                viewport={{ once: true }}
                className="lg:text-xl text-lg leading-relaxed tracking-wider font-light text-amber-700 dark:text-white">
                Create an account to get started. You will need to sign up with your email and create a password.
                Enjoy the Free 10,000 credits every month.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        <div>
          <motion.div
            {...fadeInLeft}
            viewport={{ once: true }}
            className="p-8 rounded-lg flex flex-col lg:flex-row gap-4 justify-center items-start"
          >
            <motion.div
              className="flex flex-col gap- lg:w-1/2 w-full mt-8"
            >

              <motion.h2
                {...fadeInRight}
                viewport={{ once: true }}
                className="text-xl font-semibold text-orange-400 dark:text-orange-300 mb-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/50 text-white text-xl font-light flex-shrink-0">
                    2
                  </div>
                  <span className="ml-3 text-2xl font-semibold text-orange-500 dark:text-orange-400">
                    Get the Insights of the verse you need
                  </span>
                </div>
              </motion.h2>

              <motion.p
                {...fadeInRight}
                viewport={{ once: true }}
                className="lg:text-xl text-lg leading-relaxed tracking-wider font-light text-amber-700 dark:text-white">
                Get the insights by searching for a gospel and the verse you need.
                Using the deep learning model of AI agent, it will give you the following: 
              </motion.p>

              <motion.ul className="lg:text-xl text-lg leading-relaxed tracking-wider font-light text-amber-700 dark:text-white list-disc list-inside mt-8 list-style-circle">
                <li className="mb-2">Full biblical context of the verse</li>
                <li className="mb-2">Historical background</li>
                <li className="mb-2">7-day bible actionable plan</li>
                <li className="mb-2">Short Prayer based on the verse</li>
              </motion.ul>
            </motion.div>
            <Image 
              src="/mobile-2.png"
              alt="Mobile 2"
              width={300}
              height={200}
              className="mx-auto block"
              style={{ width: "auto", height: "auto" }}
              priority
            />

          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Start Your Journey Section
const StartYourJourneySection = () => {
  return (
    <section id="start-your-journey" className="py-20 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-slate-200/20 dark:to-slate-300/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-semibold text-orange-400 dark:text-orange-400">Start Your Journey</h2>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <p className="text-xl text-orange-800 dark:text-orange-300 leading-relaxed mb-8">
              &quot;The Afikomen reminds us that God&apos;s plan for redemption has always been hidden in plain sight, 
              waiting to be revealed through Christ.&quot;
            </p>
            
            <div className="bg-amber-100 dark:bg-amber-100/20 p-6 rounded-lg mb-8">
              <p className="text-lg text-amber-900 dark:text-amber-100 font-medium mb-2">
                &quot;For Christ, our Passover Lamb, has been sacrificed.&quot;
              </p>
              <p className="text-amber-700 dark:text-amber-300">— 1 Corinthians 5:7</p>
            </div>
            
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-600 cursor-pointer duration-500 transition-all hover:bg-amber-700 text-white px-8 py-4 rounded-full lg:text-lg text-[0.785rem] font-medium shadow-lg hover:shadow-xl"
              >
                Create an Account & Start Your Journey Now!
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Landing Page Component
export default function Home() {
  return (
    <>
      <Head>
        <title>The Afikomen: Hidden Redemption Revealed | Passover Symbol & Christian Connection</title>
        <meta name="description" content="Discover the ancient Passover symbol of the Afikomen and its profound Christian connection. Learn about Jewish tradition, biblical symbolism, and how it points to Jesus Christ." />
        <meta name="keywords" content="Afikomen, Passover, Jewish tradition, Christian symbolism, Jesus Christ, redemption, matzah, Seder" />
        <meta name="author" content="The Afikomen Project" />
        <meta property="og:title" content="The Afikomen: Hidden Redemption Revealed" />
        <meta property="og:description" content="Discover the ancient Passover symbol that points to a greater story of redemption." />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">

      {/* <Header /> */}
      <Header />

      {/* Bible Search Section */}
      <BibleSearchSection />

      {/* What is Afikomen Section */}
      <WhatIsAfikomenSection />


      {/* Afikomen App Section */}
      <AfikomenAppSection />

      {/* Start Your Journey Section */}
      <StartYourJourneySection />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-gray-900 text-slate-100 dark:text-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="pt-6">
            <p className="text-slate-300 dark:text-slate-400 text-xs uppercase font-thin tracking-widest">
              © 2025 Afikomen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
