# ReactBits MCP Server Setup

This project has been configured with the ReactBits MCP (Model Context Protocol) server for enhanced React development capabilities.

## What is ReactBits MCP Server?

ReactBits MCP server provides AI-powered assistance for React development, including:
- Component generation
- Code optimization suggestions
- Best practices recommendations
- Development workflow improvements

## Configuration

The MCP server is configured in `mcp-config.json` with the following settings:
- **Server Name**: reactbits
- **Command**: npx reactbits-dev-mcp-server
- **Environment**: GitHub token for authentication

## Usage

### Starting the Server

You can start the MCP server using the following npm scripts:

```bash
# Start the server in production mode
npm run mcp:start

# Start the server in development mode
npm run mcp:dev
```

### Manual Start

You can also start the server manually:

```bash
npx reactbits-dev-mcp-server
```

## Security Note

⚠️ **Important**: The GitHub token in the configuration should be kept secure. Consider:
- Regenerating the token if it has been exposed
- Using environment variables in production
- Adding `mcp-config.json` to `.gitignore` if it contains sensitive information

## Integration

The MCP server can be integrated with:
- AI coding assistants
- Development environments that support MCP
- Custom development workflows

## Troubleshooting

If you encounter issues:
1. Check that the package is installed: `npm list reactbits-dev-mcp-server`
2. Verify your GitHub token is valid
3. Check the server logs for error messages
4. Ensure you have the required Node.js version

## Dependencies

- `reactbits-dev-mcp-server` (installed as dev dependency)
- Node.js 20.18.0+ (current: v20.18.0)
- npm 11.2.0+
