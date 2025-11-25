/**
 * OtpEmail Component
 * 
 * Email template for OTP verification with TASFRL branding.
 * 
 * Props:
 * - otp: One-time password code (required)
 * - verificationLink: Link to verify account (optional)
 * - userName: User's name (optional)
 * - loginTime: Login attempt time (optional, defaults to current time)
 * - ipAddress: IP address (optional)
 * - location: Location (optional)
 * - browser: Browser info (optional)
 * - websiteUrl: Website URL (defaults to 'https://tasfrl.org')
 * - contactUrl: Contact page URL (defaults to 'https://tasfrl.org/contact')
 * - facebookUrl: Facebook URL (defaults to 'https://facebook.com/tasfrl')
 * - instagramUrl: Instagram URL (defaults to 'https://instagram.com/tasfrl')
 * - linkedinUrl: LinkedIn URL (defaults to 'https://linkedin.com/company/tasfrl')
 */
import {
    Head,
    Preview,
    Body,
    Section,
    Text,
    Container,
    Tailwind,
    Img,
} from '@react-email/components'

interface OtpEmailProps {
    otp: string
    verificationLink?: string
    userName?: string
    loginTime?: string
    ipAddress?: string
    location?: string
    browser?: string
    websiteUrl?: string
    contactUrl?: string
    facebookUrl?: string
    instagramUrl?: string
    linkedinUrl?: string
}

export const OtpEmail = ({ 
    otp,
    verificationLink,
    userName,
    loginTime = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    ipAddress,
    location,
    browser,
    websiteUrl = 'https://tasfrl.org',
    contactUrl = 'https://tasfrl.org/contact',
    facebookUrl = 'https://facebook.com/tasfrl',
    instagramUrl = 'https://instagram.com/tasfrl',
    linkedinUrl = 'https://linkedin.com/company/tasfrl'
}: OtpEmailProps) => {
    return (
        <Tailwind>
            <Head />
            <Preview>Your TASFRL verification code</Preview>
            <Body style={{ backgroundColor: '#F0F0F0', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', padding: 0, width: '100%' }}>
                    {/* Header Section with Background Image */}
                    <Section style={{ 
                        backgroundImage: 'url(https://images.ctfassets.net/zqil9univ55g/3xeNyKyUfmUQkTqj8aMMzp/3cf00e14ab8f73e99bae12cbd0fa181a/bg-otp-head.png)', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        padding: '48px 0 32px 0', 
                        textAlign: 'center',
                        width: '100%'
                    }}>
                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td align="center" style={{ paddingBottom: '10px' }}>
                                        <Img
                                            src="https://images.ctfassets.net/zqil9univ55g/6sr5q8ejXPdhtUW5mPNJ06/8774c49049dac8a14b1606603da96ae6/4-transparent-20240325t214606z-001-4-transparent-1-logotype-horizontal-tasfrl-logo-5.png"
                                            alt="TASFR Logo"
                                            width="129"
                                            style={{ display: 'block', margin: '0 auto' }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style={{ paddingBottom: '9px' }}>
                                        <Text style={{
                                            fontFamily: 'Archivo, Arial, sans-serif',
                                            fontWeight: 700,
                                            fontSize: '40px',
                                            lineHeight: '44px',
                                            color: '#FFFFFF',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                            textAlign: 'center'
                                        }}>
                                            SecureAuth
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <Text style={{
                                            fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                            fontWeight: 400,
                                            fontSize: '11px',
                                            lineHeight: '14px',
                                            color: '#FFFFFF',
                                            margin: 0,
                                            letterSpacing: '-0.01em',
                                            textAlign: 'center'
                                        }}>
                                            Secure Authentication Platform
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>

                    {/* Main Content Section */}
                    <Section style={{ background: '#FFFFFF', padding: '38px 20px' }}>
                        {/* Greeting */}
                        <Section style={{ textAlign: 'center', padding: '0', margin: '0 0 33px 0', width: '100%' }}>
                            <Text style={{
                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '28px',
                                color: '#000000',
                                margin: '0 0 13px 0',
                                letterSpacing: '-0.01em',
                            }}>
                                Hello{userName ? ` ${userName}` : ''},
                            </Text>
                            <Text style={{
                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '22px',
                                color: '#000000',
                                margin: 0,
                                letterSpacing: '-0.01em',
                            }}>
                                We've received a request to verify your account. Here's your secure verification code:
                            </Text>
                        </Section>

                        {/* OTP Code Section */}
                        <Section style={{
                            background: '#F9FAFB',
                            borderRadius: '12px',
                            padding: '30px 20px',
                            width: '100%',
                            maxWidth: '534px',
                            textAlign: 'center',
                            margin: '0 auto 33px'
                        }}>
                            <Text style={{
                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '22px',
                                color: '#828282',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.01em',
                                margin: '0 0 17px 0'
                            }}>
                                Your Verification Code
                            </Text>
                            
                            {/* OTP Code - Single Display */}
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto', width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{
                                            background: '#ECFFE4',
                                            border: '2px solid #8AB179',
                                            borderRadius: '12px',
                                            padding: '24px',
                                            textAlign: 'center'
                                        }}>
                                            <Text style={{
                                                fontFamily: 'monospace',
                                                fontSize: '48px',
                                                fontWeight: 'bold',
                                                color: '#4B7738',
                                                letterSpacing: '8px',
                                                margin: 0,
                                                userSelect: 'all'
                                            }}>
                                                {otp}
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '24px auto 0', width: '100%' }}>
                                <tbody>
                                    {verificationLink && (
                                        <tr>
                                            <td style={{ textAlign: 'center' }}>
                                                <a href={verificationLink} style={{
                                                    display: 'inline-block',
                                                    backgroundColor: '#4B7738',
                                                    color: '#ffffff',
                                                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                    borderRadius: '8px',
                                                    padding: '14px 32px',
                                                    margin: '0 0 16px 0'
                                                }}>
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td style={{ textAlign: 'center' }}>
                                            <Text style={{
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontSize: '12px',
                                                lineHeight: '22px',
                                                color: '#D97706',
                                                margin: 0,
                                                letterSpacing: '-0.01em',
                                            }}>
                                                ⏱ This code will expire in 5 minutes
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Security Reminder */}
                        <Section style={{
                            background: '#FEF2F2',
                            border: '1px solid #EA6C6C',
                            borderRadius: '12px',
                            padding: '23px 20px',
                            width: '100%',
                            maxWidth: '534px',
                            margin: '0 auto 33px'
                        }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Text style={{
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 700,
                                                fontSize: '18px',
                                                lineHeight: '22px',
                                                color: '#9F2F2F',
                                                margin: '0 0 17px 0',
                                                letterSpacing: '-0.01em',
                                            }}>
                                                ⓘ Security Reminder
                                            </Text>
                                            <Text style={{
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '14px',
                                                lineHeight: '22px',
                                                color: '#EA6C6C',
                                                margin: '0 0 12px 0',
                                                letterSpacing: '-0.01em',
                                            }}>
                                                Do not share this code with anyone for your security. Our team will never ask for your verification code.
                                            </Text>
                                            <Text style={{
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '22px',
                                                color: '#EA6C6C',
                                                margin: 0,
                                                letterSpacing: '-0.01em',
                                            }}>
                                                • This code is valid for 5 minutes only<br />
                                                • Use it only on our official website or app<br />
                                                • If you didn't request this code, please contact support immediately
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Login Attempt Detail - Only show if we have any login data */}
                        {(loginTime || ipAddress || location || browser) && (
                            <Section style={{
                                background: '#F9FAFB',
                                borderRadius: '12px',
                                padding: '30px 20px',
                                width: '100%',
                                maxWidth: '534px',
                                margin: '0 auto'
                            }}>
                                <Text style={{
                                    fontFamily: 'General Sans, Arial, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    lineHeight: '22px',
                                    color: '#000000',
                                    margin: '0 0 30px 0'
                                }}>
                                    Login Attempt Detail
                                </Text>
                                
                                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: '100%' }}>
                                    <tbody>
                                        {loginTime && (
                                            <tr>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    paddingBottom: '14px'
                                                }}>
                                                    Time
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'center',
                                                    paddingBottom: '14px'
                                                }}>
                                                    :
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'right',
                                                    paddingBottom: '14px'
                                                }}>
                                                    {loginTime}
                                                </td>
                                            </tr>
                                        )}
                                        {ipAddress && (
                                            <tr>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    paddingBottom: '14px'
                                                }}>
                                                    IP Address
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'center',
                                                    paddingBottom: '14px'
                                                }}>
                                                    :
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'right',
                                                    paddingBottom: '14px'
                                                }}>
                                                    {ipAddress}
                                                </td>
                                            </tr>
                                        )}
                                        {location && (
                                            <tr>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    paddingBottom: '14px'
                                                }}>
                                                    Location
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'center',
                                                    paddingBottom: '14px'
                                                }}>
                                                    :
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'right',
                                                    paddingBottom: '14px'
                                                }}>
                                                    {location}
                                                </td>
                                            </tr>
                                        )}
                                        {browser && (
                                            <tr>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383'
                                                }}>
                                                    Browser
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'center'
                                                }}>
                                                    :
                                                </td>
                                                <td style={{
                                                    fontFamily: 'General Sans, Arial, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    lineHeight: '19px',
                                                    color: '#838383',
                                                    textAlign: 'right'
                                                }}>
                                                    {browser}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </Section>
                        )}
                    </Section>

                    {/* Footer Section */}
                    <Section style={{ background: '#4B7738', padding: '29px 20px', textAlign: 'center' }}>
                        {/* Logo and Tagline */}
                        <Section style={{ marginBottom: '30px' }}>
                            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td align="center" style={{ paddingBottom: '12px' }}>
                                            <Img
                                                src="https://images.ctfassets.net/zqil9univ55g/6sr5q8ejXPdhtUW5mPNJ06/8774c49049dac8a14b1606603da96ae6/4-transparent-20240325t214606z-001-4-transparent-1-logotype-horizontal-tasfrl-logo-5.png"
                                                alt="TASFR Logo"
                                                width="129"
                                                style={{ display: 'block', margin: '0 auto' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <Text style={{
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 400,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                color: '#FFFFFF',
                                                margin: 0,
                                                letterSpacing: '-0.01em',
                                            }}>
                                                Your trusted authentication partner
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Links */}
                        <Section style={{ marginBottom: '30px' }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{
                                            fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            lineHeight: '22px',
                                            color: '#FFFFFF',
                                            letterSpacing: '-0.01em',
                                            padding: '0 10px'
                                        }}>
                                            TASFRL
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <span style={{ color: '#FFFFFF' }}>|</span>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <a href={websiteUrl} style={{
                                                color: '#E2A922',
                                                textDecoration: 'none',
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                Website
                                            </a>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <span style={{ color: '#FFFFFF' }}>|</span>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <a href={contactUrl} style={{
                                                color: '#E2A922',
                                                textDecoration: 'none',
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                Contact us
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Social Links */}
                        <Section style={{ marginBottom: '30px' }}>
                            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{
                                            fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '22px',
                                            color: '#FFFFFF',
                                            letterSpacing: '-0.01em',
                                            padding: '0 10px'
                                        }}>
                                            Follow us :
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <span style={{ color: '#FFFFFF' }}>|</span>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <a href={facebookUrl} style={{
                                                color: '#E2A922',
                                                textDecoration: 'none',
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                Facebook
                                            </a>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <span style={{ color: '#FFFFFF' }}>|</span>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <a href={instagramUrl} style={{
                                                color: '#E2A922',
                                                textDecoration: 'none',
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                Instagram
                                            </a>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <span style={{ color: '#FFFFFF' }}>|</span>
                                        </td>
                                        <td style={{ padding: '0 10px' }}>
                                            <a href={linkedinUrl} style={{
                                                color: '#E2A922',
                                                textDecoration: 'none',
                                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                LinkedIn
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        {/* Disclaimer */}
                        <Section>
                            <Text style={{
                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '20px',
                                color: '#FFFFFF',
                                margin: '0 0 16px 0',
                                textAlign: 'center',
                                letterSpacing: '-0.01em',
                            }}>
                                This email was sent to you because you requested a verification code for your TASFRL account. If you did not make this request, please contact our support team immediately.
                            </Text>
                        </Section>

                        {/* Divider and Copyright */}
                        <Section>
                            <hr style={{ border: 'none', borderTop: '1px solid #5C8949', margin: '0 0 16px 0' }} />
                            <Text style={{
                                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '20px',
                                color: '#FFFFFF',
                                margin: 0,
                                textAlign: 'center',
                                letterSpacing: '-0.01em',
                            }}>
                                © 2024 TASFRL Inc. All rights reserved.
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Tailwind>
    )
}

export default OtpEmail

// Default export with example data for React Email preview
OtpEmail.PreviewProps = {
    otp: '123456',
    userName: 'Alex Johnson',
    loginTime: 'December 15, 2025 at 02:30 PM',
    ipAddress: '192.168.1.100',
    location: 'New York, USA',
    browser: 'Chrome 120.0 on Windows',
    websiteUrl: 'https://tasfrl.org',
    contactUrl: 'https://tasfrl.org/contact',
    facebookUrl: 'https://facebook.com/tasfrl',
    instagramUrl: 'https://instagram.com/tasfrl',
    linkedinUrl: 'https://linkedin.com/company/tasfrl'
} as OtpEmailProps
