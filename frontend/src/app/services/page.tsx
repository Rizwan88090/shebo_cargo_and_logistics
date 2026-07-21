"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdFlight, MdDirectionsBoat, MdLocalShipping, MdHome, MdBusiness, MdDirectionsCar, MdWarehouse, MdArrowForward } from "react-icons/md";
import { services } from "@/data/services";
import styles from "./services.module.css";

const iconMap: Record<string, React.ReactNode> = {
  MdFlight: <MdFlight />,
  MdDirectionsBoat: <MdDirectionsBoat />,
  MdLocalShipping: <MdLocalShipping />,
  MdHome: <MdHome />,
  MdBusiness: <MdBusiness />,
  MdDirectionsCar: <MdDirectionsCar />,
  MdWarehouse: <MdWarehouse />,
};

export default function ServicesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__content container">
          <motion.h1
            className="page-hero__title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            className="page-hero__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We offer specialized logistical solutions to ensure your goods and assets are delivered on time, every time.
          </motion.p>
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="section">
        <div className="container">
          <div className={styles.servicesList}>
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                className={`${styles.serviceRow} ${index % 2 !== 0 ? styles.rowReverse : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Image */}
                <div className={styles.imageColumn}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={550}
                      height={360}
                      className={styles.image}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={styles.contentColumn}>
                  <div className={styles.iconWrapper}>{iconMap[service.icon]}</div>
                  <h2 className={styles.serviceTitle}>{service.title}</h2>
                  <p className={styles.serviceDesc}>{service.description}</p>

                  <h4 className={styles.featuresHeading}>Key Features:</h4>
                  <ul className={styles.featuresList}>
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className={styles.featureItem}>
                        <span className={styles.checkDot} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.actions}>
                    <Link href={`/services/${service.slug}`} className="btn btn-primary">
                      View Details <MdArrowForward />
                    </Link>
                    <Link
                      href={`/request-quote?service=${service.slug}`}
                      className="btn btn-outline"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
