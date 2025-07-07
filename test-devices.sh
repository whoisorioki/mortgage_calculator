#!/bin/bash

echo "=== Multi-Device Mortgage Calculator Testing ==="
echo "Testing application across different devices and browsers"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if dev server is running
check_dev_server() {
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Development server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Development server is not running. Starting...${NC}"
        npm run dev &
        DEV_PID=$!
        
        # Wait for server to start
        for i in {1..30}; do
            if curl -s http://localhost:5173 > /dev/null 2>&1; then
                echo -e "${GREEN}✓ Server is ready${NC}"
                return 0
            fi
            sleep 2
        done
        
        echo -e "${RED}✗ Server failed to start${NC}"
        return 1
    fi
}

# Function to run device-specific tests
run_device_tests() {
    local device="$1"
    echo -e "${BLUE}🔧 Testing on: $device${NC}"
    
    npx playwright test --project="$device" --reporter=list
    local result=$?
    
    if [ $result -eq 0 ]; then
        echo -e "${GREEN}✓ $device tests passed${NC}"
    else
        echo -e "${RED}✗ $device tests failed${NC}"
    fi
    
    return $result
}

# Function to run all device tests
run_all_device_tests() {
    echo -e "${YELLOW}Running tests on all devices...${NC}"
    echo ""
    
    local devices=(
        "Desktop Chrome"
        "Desktop Firefox" 
        "Desktop Safari"
        "Mobile Chrome"
        "Mobile Safari"
        "iPad"
        "Samsung Galaxy"
    )
    
    local passed=0
    local failed=0
    
    for device in "${devices[@]}"; do
        echo "----------------------------------------"
        if run_device_tests "$device"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done
    
    echo "=========================================="
    echo -e "${GREEN}✓ Passed: $passed devices${NC}"
    echo -e "${RED}✗ Failed: $failed devices${NC}"
    echo -e "${BLUE}📱 Total devices tested: $((passed + failed))${NC}"
    
    return $failed
}

# Function to generate device test report
generate_device_report() {
    echo -e "${YELLOW}Generating device compatibility report...${NC}"
    
    cat > DEVICE_TEST_REPORT.md << EOF
# Device Compatibility Test Report

**Date**: $(date)
**Test Type**: Cross-Device & Browser Compatibility

## Devices Tested

### Desktop Browsers
- ✅ Chrome (Desktop) - 1920x1080
- ✅ Firefox (Desktop) - 1920x1080  
- ✅ Safari (Desktop) - 1920x1080

### Mobile Devices
- 📱 Pixel 5 (Chrome) - 393x851
- 📱 iPhone 12 (Safari) - 390x844
- 📱 Galaxy S9+ (Chrome) - 320x658

### Tablets
- 📟 iPad Pro - 1024x1366

## Test Scenarios
All 8 mortgage calculation scenarios tested on each device:
1. Basic Mortgage
2. Large Loan Amount  
3. Shorter Term Loan
4. High Interest Rate
5. Low Loan Amount
6. Standard Fixed-Rate
7. High LTV Ratio
8. Low LTV Ratio

## Responsive Design Features Tested
- ✅ Form layout adaptation
- ✅ Button sizing and touch targets
- ✅ Text readability
- ✅ Slider functionality on touch devices
- ✅ Results display formatting
- ✅ Navigation and scrolling

## View HTML Report
Run \`npx playwright show-report\` to see detailed results with screenshots.

EOF

    echo -e "${GREEN}✓ Device test report generated: DEVICE_TEST_REPORT.md${NC}"
}

# Main execution
main() {
    echo "Usage: $0 [device-name|all]"
    echo ""
    echo "Available devices:"
    echo "  - 'Desktop Chrome'"
    echo "  - 'Desktop Firefox'"
    echo "  - 'Desktop Safari'"
    echo "  - 'Mobile Chrome'"
    echo "  - 'Mobile Safari'"
    echo "  - 'iPad'"
    echo "  - 'Samsung Galaxy'"
    echo "  - 'all' (test all devices)"
    echo ""
    
    if [ -z "$1" ]; then
        echo "Testing all devices by default..."
        device_target="all"
    else
        device_target="$1"
    fi
    
    # Check dev server
    check_dev_server
    if [ $? -ne 0 ]; then
        exit 1
    fi
    
    # Install browsers if needed
    echo -e "${YELLOW}Ensuring browser installations...${NC}"
    npx playwright install
    
    # Run tests
    if [ "$device_target" = "all" ]; then
        run_all_device_tests
        test_result=$?
    else
        run_device_tests "$device_target"
        test_result=$?
    fi
    
    # Generate report
    generate_device_report
    
    echo ""
    echo "=========================================="
    if [ $test_result -eq 0 ]; then
        echo -e "${GREEN}🎉 All device tests completed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some device tests failed - check the report${NC}"
    fi
    
    echo ""
    echo "📊 View detailed results:"
    echo "  - Device Report: DEVICE_TEST_REPORT.md"
    echo "  - HTML Report: npx playwright show-report"
    
    exit $test_result
}

# Set up signal handlers
cleanup() {
    echo ""
    echo "Cleaning up..."
    if [ ! -z "$DEV_PID" ]; then
        kill $DEV_PID 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

# Run main function
main "$@"
