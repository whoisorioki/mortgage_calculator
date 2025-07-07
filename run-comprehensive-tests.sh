#!/bin/bash

echo "=== Comprehensive Mortgage Calculator Testing ==="
echo "Starting comprehensive test suite with scenarios from spreadsheet"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if dev server is running
check_dev_server() {
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Development server is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Development server is not running${NC}"
        return 1
    fi
}

# Function to start dev server
start_dev_server() {
    echo -e "${YELLOW}Starting development server...${NC}"
    npm run dev &
    DEV_PID=$!
    echo "Development server PID: $DEV_PID"
    
    # Wait for server to start
    echo "Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Server is ready${NC}"
            return 0
        fi
        sleep 2
    done
    
    echo -e "${RED}✗ Server failed to start${NC}"
    return 1
}

# Function to stop dev server
stop_dev_server() {
    if [ ! -z "$DEV_PID" ]; then
        echo -e "${YELLOW}Stopping development server (PID: $DEV_PID)...${NC}"
        kill $DEV_PID 2>/dev/null
        wait $DEV_PID 2>/dev/null
    fi
    
    # Kill any remaining processes on port 5173
    pkill -f "vite.*5173" 2>/dev/null || true
}

# Function to run playwright tests
run_playwright_tests() {
    echo -e "${YELLOW}Running Playwright E2E tests...${NC}"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Install Playwright browsers if needed
    if [ ! -d "node_modules/.cache/ms-playwright" ]; then
        echo "Installing Playwright browsers..."
        npx playwright install
    fi
    
    # Run tests
    npx playwright test tests/mortgage-calculator.spec.ts --reporter=html
    TEST_EXIT_CODE=$?
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
    else
        echo -e "${RED}✗ Some tests failed${NC}"
    fi
    
    return $TEST_EXIT_CODE
}

# Function to generate test report
generate_test_report() {
    echo -e "${YELLOW}Generating test report...${NC}"
    
    cat > test-report.md << EOF
# Mortgage Calculator Test Report

**Date**: $(date)
**Test Scenarios**: 8 comprehensive scenarios from spreadsheet

## Test Scenarios Covered:

1. **Basic Mortgage**
   - Property: £150,000, Down Payment: £30,000 (20%), Term: 25 years, Rate: 3.5%
   - Expected Monthly P&I: ~£600.38

2. **Large Loan Amount**
   - Property: £500,000, Down Payment: £100,000 (20%), Term: 30 years, Rate: 4.2%
   - Expected Monthly P&I: ~£1,957.01

3. **Shorter Term Loan**
   - Property: £200,000, Down Payment: £40,000 (20%), Term: 15 years, Rate: 3.0%
   - Expected Monthly P&I: ~£1,106.18

4. **High Interest Rate**
   - Property: £120,000, Down Payment: £24,000 (20%), Term: 20 years, Rate: 5.5%
   - Expected Monthly P&I: ~£653.23

5. **Low Loan Amount, Adjustable Rate**
   - Property: £75,000, Down Payment: £15,000 (20%), Term: 10 years, Rate: 2.8%
   - Expected Monthly P&I: ~£576.87

6. **Interest-Only Mortgage**
   - Property: £250,000, Down Payment: £50,000 (20%), Term: 25 years, Rate: 4.0%
   - Expected Monthly P&I: ~£666.67

7. **High Loan-to-Value (LTV) Ratio**
   - Property: £400,000, Down Payment: £50,000 (12.5%), Term: 30 years, Rate: 4.5%
   - Expected Monthly P&I: ~£1,773.40

8. **Low LTV Ratio**
   - Property: £250,000, Down Payment: £150,000 (60%), Term: 20 years, Rate: 3.75%
   - Expected Monthly P&I: ~£591.88

## Test Results:

EOF

    if [ -f "playwright-report/index.html" ]; then
        echo "- Playwright test report generated at: playwright-report/index.html" >> test-report.md
    fi
    
    echo -e "${GREEN}✓ Test report generated: test-report.md${NC}"
}

# Function to run Azure deployment tests
run_azure_tests() {
    echo -e "${YELLOW}Azure Deployment Testing Instructions${NC}"
    echo ""
    echo "To test the application after Azure deployment:"
    echo ""
    echo "1. Build the application:"
    echo "   npm run build"
    echo ""
    echo "2. Deploy to Azure Static Web Apps using:"
    echo "   - Azure CLI: az staticwebapp create"
    echo "   - GitHub Actions (automatic deployment)"
    echo "   - VS Code Azure Static Web Apps extension"
    echo ""
    echo "3. Once deployed, update the base URL in playwright.config.ts:"
    echo "   baseURL: 'https://your-app-name.azurestaticapps.net'"
    echo ""
    echo "4. Run tests against production:"
    echo "   npm run test:e2e"
    echo ""
    echo "5. Manual testing checklist:"
    echo "   - Test all 8 scenarios from the spreadsheet"
    echo "   - Verify responsive design on different devices"
    echo "   - Check HTTPS security"
    echo "   - Test form validation"
    echo "   - Verify calculation accuracy"
    echo ""
}

# Main execution
main() {
    echo "=== Starting Comprehensive Test Suite ==="
    echo ""
    
    # Check if we're in development mode
    if [ "$1" = "dev" ]; then
        echo "Running in development mode..."
        
        # Check if dev server is running, if not start it
        if ! check_dev_server; then
            start_dev_server
            if [ $? -ne 0 ]; then
                echo -e "${RED}Failed to start development server${NC}"
                exit 1
            fi
        fi
        
        # Run tests
        run_playwright_tests
        TEST_RESULT=$?
        
        # Generate report
        generate_test_report
        
        # Show results
        echo ""
        echo "=== Test Results ==="
        if [ $TEST_RESULT -eq 0 ]; then
            echo -e "${GREEN}✓ All tests passed successfully!${NC}"
        else
            echo -e "${RED}✗ Some tests failed - check the report for details${NC}"
        fi
        
        echo ""
        echo "View detailed test report:"
        echo "  - HTML Report: playwright-report/index.html"
        echo "  - Summary: test-report.md"
        
        # Stop dev server if we started it
        if [ ! -z "$DEV_PID" ]; then
            stop_dev_server
        fi
        
    elif [ "$1" = "azure" ]; then
        run_azure_tests
        
    else
        echo "Usage: $0 [dev|azure]"
        echo ""
        echo "  dev    - Run tests in development mode"
        echo "  azure  - Show Azure deployment testing instructions"
        echo ""
        echo "Examples:"
        echo "  $0 dev    # Run comprehensive tests locally"
        echo "  $0 azure  # Get Azure testing instructions"
    fi
}

# Cleanup function
cleanup() {
    echo ""
    echo "Cleaning up..."
    stop_dev_server
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Run main function
main "$@"
